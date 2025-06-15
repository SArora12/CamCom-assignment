# Load Distributer for FastAPI Applications

## Overview

This project demonstrates a round-robin load distributer for four identical FastAPI instances. It includes:

- **`app.py`**: Backend FastAPI application with CRUD endpoints and a `/ping` health check.
- **`run_servers.py`**: Script to launch four Uvicorn server instances on ports **8000**, **8001**, **8002**, and **8003**.
- **`load_distributer.py`**: Proxy FastAPI service on port **8080** that distributes incoming requests using round-robin and maintains sticky sessions for `items`.
- **`test_load_distributer.py`**: Pytest suite (with `pytest-asyncio`) verifying request distribution, concurrency, and method forwarding.
- **`pytest.ini`**: Configuration for `pytest-asyncio` to enable async tests.

---

## My Approach and Thought Process

The goal was to build a system that distributes requests across multiple backend instances. My approach focused on creating a decoupled and a testable simulation.

**1. System Architecture Design:**
There are two distinct components:

- **The Backend Application:** A simple service that performs some work.
- **The Load Distributor:** A single entry point that intelligently forwards traffic to the backends.

**2. Implementing the Backend Environment:**
To satisfy the requirement of running the application on four ports, I created the `run_servers.py` script. Using Python's `multiprocessing` library is a lightweight and effective way to launch and manage multiple server instances from a single command.

**3. Designing the Load Distributor:**
This was the core of the task. My design choices were:

- **Implementation Strategy:** I decided to implement the proxy logic as **FastAPI middleware**. This is a powerful pattern because middleware intercepts every single incoming request before it hits any specific route handler. This allowed me to create a generic proxy that works for all paths and HTTP methods (GET, POST, etc.) without writing repetitive code.
- **Round-Robin Logic:** For the core distribution method, `itertools.cycle` is the most Pythonic and efficient tool. It creates an iterator that endlessly cycles through the list of backends, ensuring a fair, sequential distribution of requests.

**4. Going Beyond the Basic Requirements: Sticky Sessions:**
While implementing, I realized a simple round-robin approach would fail in a stateful application. Since each backend has its own in-memory `items` dictionary, creating an item on server `8000` and then trying to retrieve it from server `8001` would result in a "Not Found" error. To solve this, I implemented a "sticky session" mechanism.

- I created a shared dictionary (`item_map`) in the distributor to store a mapping of `item_id` to the backend URL that handled its creation.
- The middleware logic was enhanced: for any request involving an `item_id` (like `GET /items/42`), it first checks the map. If an entry exists, it routes the request directly to the "sticky" backend. For all other requests, it falls back to the standard round-robin behavior.

**5. Ensuring Robustness with Testing:**
I wrote a `pytest` suite using the `pytest-asyncio` plugin to verify all aspects of the functionality, including correct round-robin sequencing, proper concurrent request distribution, and the successful proxying of different HTTP methods.

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

- **Python**: 3.9+
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
   git clone https://github.com/SArora12/CamCom-assignment.git
   cd backend_assignment
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
