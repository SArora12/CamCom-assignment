# load_distributer.py
import itertools
import logging

import httpx
from fastapi import FastAPI, Request, Response

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

BACKENDS = [
    "http://localhost:8000",
    "http://localhost:8001",
    "http://localhost:8002",
    "http://localhost:8003",
]
_rr = itertools.cycle(BACKENDS)

# Sticky map for item_id → backend URL
item_map: dict[int, str] = {}


@app.middleware("http")
async def proxy(request: Request, call_next):
    path = request.url.path
    method = request.method

    # Determine target
    target: str
    # 1. GET or PUT on /items/{item_id} → use sticky map
    if path.startswith("/items/") and method in ("GET", "PUT"):
        try:
            item_id = int(path.split("/")[2])
        except (IndexError, ValueError):
            target = next(_rr)
        else:
            target = item_map.get(item_id, next(_rr))

    # 2. POST on /items/ → RR + record stickiness
    elif path == "/items/" and method == "POST":
        target = next(_rr)
        params = dict(request.query_params)
        item_id_str = params.get("item_id")
        if item_id_str and item_id_str.isdigit():
            item_map[int(item_id_str)] = target

    # 3. All other routes → pure round-robin
    else:
        target = next(_rr)

    # Build URL
    url = f"{target}{path}"
    if request.url.query:
        url += f"?{request.url.query}"

    # Logging for visibility
    logger.info(f"→ {method} {path} → {target}")

    # Forward the request
    async with httpx.AsyncClient() as client:
        forwarded = await client.request(
            method,
            url,
            headers=request.headers.raw,
            content=await request.body(),
        )

    logger.info(f"← {forwarded.status_code} from {target}")
    return Response(
        content=forwarded.content,
        status_code=forwarded.status_code,
        headers=forwarded.headers,
    )


@app.get("/")
async def health():
    return {"status": "Load Distributor is up"}
