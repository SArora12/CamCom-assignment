from time import sleep
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

app = FastAPI()
# In-memory storage for demonstration purposes
items = {}


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None


@app.get("/items/{item_id}")
def read_item(item_id: int):
    sleep(1)
    if item_id in items:
        return items[item_id]
    raise HTTPException(status_code=404, detail="Item not found")


@app.post("/items/")
def create_item(item_id: int, item: Item):
    sleep(1)
    if item_id in items:
        raise HTTPException(status_code=400, detail="Item already exists")
    items[item_id] = item
    return item


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    sleep(1)
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    items[item_id] = item
    return item


@app.get("/ping")
async def ping(request: Request):
    # request.scope['server'][1] is the port the server is bound to
    return {"port": request.scope["server"][1]}
