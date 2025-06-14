import asyncio

import pytest
from httpx import AsyncClient

BASE = "http://localhost:8080"  # your distributor


@pytest.mark.asyncio
async def test_round_robin_sequence():
    """
    Send four sequential GET /ping requests and assert
    we see ports 8000 → 8001 → 8002 → 8003 in order.
    """
    expected = [8000, 8001, 8002, 8003]
    async with AsyncClient() as client:
        ports = []
        for _ in range(4):
            resp = await client.get(f"{BASE}/ping")
            assert resp.status_code == 200
            ports.append(resp.json()["port"])
    assert ports == expected


@pytest.mark.asyncio
async def test_cycle_repeats_after_four():
    """
    Send six sequential requests: expect [8000,8001,8002,8003,8000,8001]
    """
    expected = [8000, 8001, 8002, 8003, 8000, 8001]
    async with AsyncClient() as client:
        ports = [
            (await client.get(f"{BASE}/ping")).json()["port"]
            for _ in range(len(expected))
        ]
    assert ports == expected


@pytest.mark.asyncio
async def test_concurrent_requests_distribution():
    """
    Fire eight concurrent GETs and ensure we get two hits on each backend.
    """
    async with AsyncClient() as client:
        tasks = [client.get(f"{BASE}/ping") for _ in range(8)]
        responses = await asyncio.gather(*tasks)
    ports = sorted(r.json()["port"] for r in responses)
    # two of each 8000,8001,8002,8003
    assert ports == [8000, 8000, 8001, 8001, 8002, 8002, 8003, 8003]


@pytest.mark.asyncio
async def test_various_http_methods():
    """
    Ensure POST and PUT are also proxied correctly.
    We'll use the items endpoints on the backends.
    """
    async with AsyncClient() as client:
        # Create item #42
        post = await client.post(
            f"{BASE}/items/",
            params={"item_id": 42},
            json={"name": "test", "description": "d", "price": 1.0},
        )
        assert post.status_code == 200

        # Retrieve it
        get = await client.get(f"{BASE}/items/42")
        assert get.status_code == 200 and get.json()["name"] == "test"

        # Update it
        put = await client.put(
            f"{BASE}/items/42", json={"name": "updated", "price": 2.0}
        )
        assert put.status_code == 200 and put.json()["name"] == "updated"
