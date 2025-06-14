# Load Distributer for FastAPI Applications

## Overview

This project demonstrates a round-robin load distributer for four identical FastAPI instances. It includes:

- **`app.py`**: Backend FastAPI application with CRUD endpoints and a `/ping` health check.
- **`run_servers.py`**: Script to launch four Uvicorn server instances on ports **8000**, **8001**, **8002**, and **8003**.
- **`load_distributer.py`**: Proxy FastAPI service on port **8080** that distributes incoming requests using round-robin and maintains sticky sessions for `items`.
- **`test_load_distributer.py`**: Pytest suite (with `pytest-asyncio`) verifying request distribution, concurrency, and method forwarding.
- **`pytest.ini`**: Configuration for `pytest-asyncio` to enable async tests.

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Running the Backend Servers](#running-the-backend-servers)
5. [Running the Load Distributer](#running-the-load-distributer)
6. [Usage Examples](#usage-examples)
7. [Testing](#testing)
8. [Extensibility & Production Considerations](#extensibility--production-considerations)
9. [License](#license)

---

## Directory Structure

```
load_distributer/
├── app.py                       # Backend FastAPI application
├── run_servers.py               # Launches four backend instances
├── load_distributer.py          # Round-robin proxy with sticky sessions
├── test_load_distributer.py     # Async pytest suite
└── pytest.ini                   # Pytest-asyncio configuration
```

---

## Requirements

- **Python**: 3.8+
- **Dependencies**:

  - `fastapi`
  - `uvicorn`
  - `httpx`
  - `pytest`
  - `pytest-asyncio`

Install dependencies with:

```bash
pip install fastapi uvicorn httpx pytest pytest-asyncio
```

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd load_distributer
   ```

2. **Install dependencies** (see [Requirements](#requirements)).

---

## Running the Backend Servers

Start four Uvicorn processes that serve `app.py` on ports 8000–8003:

```bash
python run_servers.py
```

Each process provides these endpoints:

- `GET /items/{item_id}`: Retrieve an item or 404 if not found.
- `POST /items/?item_id={id}`: Create a new item or 400 if it exists.
- `PUT /items/{item_id}`: Update an existing item or 404 if not found.
- `GET /ping`: Returns `{"port": <server_port>}` identifying the serving port.

---

## Running the Load Distributer

Launch the proxy service on port 8080:

```bash
uvicorn load_distributer:app --host 0.0.0.0 --port 8080
```

The distributer middleware:

1. **Round-Robin Selection**: Uses `itertools.cycle` over backend URLs to pick the next server.
2. **Sticky Sessions** for `/items/`:

   - On **POST** `/items/`, records `item_id → backend`.
   - On **GET/PUT** `/items/{item_id}`, routes to the recorded backend.

3. **Method-Agnostic**: Forwards all HTTP methods (GET, POST, PUT, etc.) preserving headers and body.

---

## Usage Examples

1. **Ping the distributer**:

   ```bash
   curl http://localhost:8080/ping
   # => {"port":8000} (then 8001, 8002, 8003, ...)
   ```

2. **Create an item**:

   ```bash
   curl -X POST "http://localhost:8080/items/?item_id=1" \
        -H "Content-Type: application/json" \
        -d '{"name":"Item1","price":10.0}'
   ```

3. **Retrieve the item**:

   ```bash
   curl http://localhost:8080/items/1
   ```

4. **Update the item**:

   ```bash
   curl -X PUT "http://localhost:8080/items/1" \
        -H "Content-Type: application/json" \
        -d '{"name":"NewName","price":12.5}'
   ```

---

## Testing

Run the async test suite with pytest:

```bash
pytest -q
```

The tests cover:

- **Sequential round-robin** on `/ping`.
- **Cycle repetition** after four requests.
- **Concurrent requests** distribution.
- **CRUD proxying** for `items` with sticky sessions.

---

## Extensibility & Production Considerations

- **Shared Data Store**: Replace in-memory `items` dict with a persistent database (e.g., PostgreSQL, Redis).
- **Dynamic Backend Discovery**: Load backend addresses from configuration or a service registry.
- **Health Checks**: Automatically remove or skip offline backends.
- **Monitoring**: Integrate metrics (Prometheus) and logging aggregation.
- **Security**: Add authentication, rate limiting, and request validation.

---
