# QC Auto-Assignment Service

## Overview

This project implements an automated QC (Quality Control) task assignment system using **FastAPI**, **MySQL**, and a background scheduler. It replaces a manual portal by:

1. Tracking logged-in QC personnel and their status (free or busy).
2. Automatically assigning pending QC tasks to available personnel.
3. Re-assigning new tasks immediately upon task completion.

Key components:

- **API Layer**: FastAPI endpoints for login/logout, task creation/completion, and status queries.
- **Database**: MySQL schema for `qc_person`, `qc_task`, and `assignment` records.
- **Scheduler**: Background job running every few seconds to match free personnel with pending tasks.

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Database Schema](#database-schema)
5. [Methodology](#methodology)
6. [Application Architecture](#application-architecture)
7. [API Endpoints](#api-endpoints)
8. [Scheduler Workflow](#scheduler-workflow)
9. [Usage Examples](#usage-examples)
10. [Extensibility & Production Considerations](#extensibility--production-considerations)
11. [License](#license)

---

## Directory Structure

```
qc_auto_assignment/
├── app.py                  # FastAPI application and endpoints
├── database.py             # MySQL connection and ORM models
├── scheduler.py            # Background task assignment logic
├── requirements.txt        # Python dependencies
└── README_qc_auto_assignment.md  # This document
```

---

## Requirements

- Python 3.8+
- MySQL Server
- Python packages:

  - `fastapi`
  - `uvicorn`
  - `sqlalchemy`
  - `pydantic`
  - `apscheduler` or `fastapi-utils`

Install with:

```bash
pip install fastapi uvicorn sqlalchemy pymysql pydantic apscheduler
```

---

## Installation

1. **Clone the repository**:

```bash
    git clone <repo-url>
    cd qc\_auto\_assignment
```

2. **Set up MySQL database** and create a user.

3. **Configure** `DATABASE_URL` in `database.py` (e.g., `mysql+pymysql://user:pass@localhost/qc_db`).

4. **Install dependencies**:

```bash
    pip install -r requirements.txt
```

---

## Database Schema

```sql
CREATE TABLE qc_person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_logged_in BOOLEAN DEFAULT FALSE,
    is_busy BOOLEAN DEFAULT FALSE,
    last_heartbeat DATETIME
);

CREATE TABLE qc_task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    status ENUM('PENDING','IN_PROGRESS','DONE') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    assigned_person_id INT NULL,
    FOREIGN KEY (assigned_person_id) REFERENCES qc_person(id)
);

CREATE TABLE assignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    person_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    FOREIGN KEY (task_id) REFERENCES qc_task(id),
    FOREIGN KEY (person_id) REFERENCES qc_person(id)
);
```

---

## Methodology

1. **Identify Actors & Data**:

   - QC personnel (`qc_person`) can log in/out and become busy/free.
   - QC tasks (`qc_task`) move from `PENDING` → `IN_PROGRESS` → `DONE`.

2. **Assignment Logic**:

   - On login, personnel appear as free.
   - Pending tasks enqueued in the DB.
   - Scheduler matches free personnel with oldest pending tasks.

3. **Automation**:

   - Use a recurring background job to poll for free personnel and tasks.
   - Update DB records atomically to avoid race conditions.

4. **API Exposure**:

   - Endpoints for login/logout, task creation, status querying, and task completion.

5. **Validation**:

   - Ensure atomic DB transactions.
   - Handle edge cases: no free personnel, no pending tasks.

---

## Application Architecture

1. **`app.py`**: Defines FastAPI, includes middleware for CORS, and mounts endpoints.
2. **`database.py`**: Creates SQLAlchemy Engine, Session, and ORM models.
3. **`scheduler.py`**: Registers a job (`APScheduler` or FastAPI-Utils `@repeat_every`) to run every 5 seconds:

   - Query `qc_person` where `is_logged_in=True` AND `is_busy=False`.
   - Query next `qc_task` where `status='PENDING'` (ordered by `created_at`).
   - Assign: Update both tables and insert into `assignment`.

Diagram:

```
+-----------+      +-------------+      +-------------+
| FastAPI   | <--> | MySQL       | <--> | Scheduler   |
| Endpoints |      | qc_person   |      | (APScheduler)|
+-----------+      | qc_task     |      +-------------+
                   | assignment  |
                   +-------------+
```

---

## API Endpoints

| Method | Path                   | Description                                     |
| ------ | ---------------------- | ----------------------------------------------- |
| POST   | `/login`               | Log in a QC person (set `is_logged_in=True`).   |
| POST   | `/logout`              | Log out a QC person (set `is_logged_in=False`). |
| POST   | `/tasks/`              | Create a new QC task (status=`PENDING`).        |
| GET    | `/persons/available`   | List free, logged-in personnel.                 |
| GET    | `/tasks/pending`       | List tasks with `PENDING` status.               |
| POST   | `/tasks/{id}/complete` | Mark task `IN_PROGRESS` → `DONE`. Free person.  |

Each endpoint performs input validation and returns JSON responses.

---

## Scheduler Workflow

1. **Interval**: runs every 5 seconds.
2. **Query Free Personnel**:

   ```python
   free_ops = session.query(QCPerson)
       .filter_by(is_logged_in=True, is_busy=False)
       .all()
   ```

3. **For each free operator**:

   - Fetch oldest pending task:

     ```python
     task = session.query(QCTask)
         .filter_by(status='PENDING')
         .order_by(QCTask.created_at)
         .first()
     ```

   - If `task` exists:

     - `task.status = 'IN_PROGRESS'`
     - `operator.is_busy = True`
     - Insert into `assignment` with `assigned_at`
     - Commit transaction

This ensures tasks are assigned as soon as possible and no operator remains idle when work is waiting.

---

## Usage Examples

1. **Start the application**:

   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

2. **Login a person**:

   ```bash
   curl -X POST http://localhost:8000/login -d '{"person_id":1}'
   ```

3. **Create a task**:

   ```bash
   curl -X POST http://localhost:8000/tasks/ -d '{"description":"Inspect batch #123"}'
   ```

4. **Complete a task**:

   ```bash
   curl -X POST http://localhost:8000/tasks/5/complete
   ```

5. **Check assignments**:

   ```bash
   curl http://localhost:8000/persons/available
   curl http://localhost:8000/tasks/pending
   ```

---

## Extensibility & Production Considerations

- **Distributed Scheduler**: Use Redis locks or Celery beat for multiple instances.
- **High Availability**: Deploy behind load balancer; configure health checks.
- **Metrics & Logging**: Integrate Prometheus, structured logs.
- **Error Handling**: Retries for DB deadlocks, exponential backoff.
- **Security**: Add authentication (OAuth, JWT), input sanitization.

---
