# **README: QC Auto-Assignment Service**

## **Overview**

This document outlines the architecture for an automated Quality Control (QC) task assignment system. Designed with Python, FastAPI, and MySQL, it replaces a manual assignment portal by intelligently distributing tasks to available personnel.

The system's core responsibilities are:

- Tracking the real-time status of QC personnel (logged-in, free, or busy).
- Maintaining a queue of pending QC tasks.
- Automatically assigning pending tasks to the next available QC person.
- Ensuring a continuous workflow by assigning a new task as soon as a previous one is finished.

---

## **System Architecture**

The system is built on a decoupled, three-component architecture to ensure scalability and maintainability.

1.  **FastAPI Application (API Layer)**: The central point of interaction for all clients (e.g., the QC web portal). It exposes a RESTful API to manage user sessions and tasks.
2.  **MySQL Database (Persistence Layer)**: Acts as the single source of truth for the system's state. It stores all information about personnel, tasks, and assignments.
3.  **Background Scheduler (Logic Engine)**: An independent process that contains the core assignment logic. It periodically polls the database to match free personnel with pending tasks, operating separately from the API to avoid blocking user requests.

```
+-----------------+      +-------------------+      +----------------------+
|  QC Web Portal  | <--> | FastAPI Endpoints  | <--> |    MySQL Database    |
| (Client)        |      | (app.py)          |      | (State & Persistence)|
+-----------------+      +-------------------+      +----------^-----------+
                                                               |
                                                               | Polls & Updates
                                                               |
                                                      +--------v----------+
                                                      | Background        |
                                                      | Scheduler         |
                                                      +-------------------+
```

---

## **Database Schema**

The database is normalized across three tables to ensure data integrity and prevent redundancy.

```sql
-- Stores personnel information and their real-time status.
CREATE TABLE qc_personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_logged_in BOOLEAN NOT NULL DEFAULT FALSE,
    is_busy BOOLEAN NOT NULL DEFAULT FALSE,
    -- Tracks the last time the user's client sent a signal.
    last_heartbeat TIMESTAMP NULL
);

-- Contains all QC tasks and their current state.
CREATE TABLE qc_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    -- PENDING: Waiting for assignment.
    -- IN_PROGRESS: Assigned to a user.
    -- COMPLETED: The work is done.
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to_id INT NULL,
    FOREIGN KEY (assigned_to_id) REFERENCES qc_personnel(id) ON DELETE SET NULL
);

-- An audit log of all historical assignments.
CREATE TABLE qc_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    person_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (task_id) REFERENCES qc_tasks(id),
    FOREIGN KEY (person_id) REFERENCES qc_personnel(id)
);
```

---

## **System Workflow**

1.  **Login**: A QC person logs in. The API marks `is_logged_in = TRUE` and sets the initial `last_heartbeat`.
2.  **Heartbeat**: The client-side portal sends a `heartbeat` request every 30-60 seconds to signal the user is still active. The API updates the `last_heartbeat` timestamp for that user.
3.  **Task Assignment**: The **Background Scheduler** runs its logic loop (see below). It identifies the logged-in, non-busy user and assigns them the oldest pending task.
4.  **Task Completion**: After finishing the task, the user submits it. The API marks the task as `COMPLETED`, sets the user's status to `is_busy = FALSE`, and logs the completion time in the `qc_assignments` table.
5.  **Re-assignment**: The user is now free. In its next cycle, the scheduler will automatically assign them a new pending task.
6.  **Stale Session Handling**: If a user's `last_heartbeat` is older than a set threshold (e.g., 90 seconds), the scheduler assumes they have disconnected and automatically logs them out by setting `is_logged_in = FALSE` and freeing up any task they had in progress.

---

## **The Scheduler: Core Assignment Engine**

The scheduler runs as a persistent background job (e.g., using `APScheduler`). To prevent race conditions in a multi-instance environment, its logic must be atomic.

**Execution Cycle (runs every 5-10 seconds):**

1.  **Clean Stale Sessions**:

    - Find all personnel where `is_logged_in = TRUE` but `last_heartbeat` is older than the timeout threshold.
    - For each stale user, set `is_logged_in = FALSE`, `is_busy = FALSE`, and set the status of any `IN_PROGRESS` task assigned to them back to `PENDING`.

2.  **Perform Assignments in a Transaction**:
    - **BEGIN a database transaction.**
    - Find the next available QC person: `SELECT * FROM qc_personnel WHERE is_logged_in = TRUE AND is_busy = FALSE LIMIT 1 FOR UPDATE;`
      - Using `FOR UPDATE` locks the selected row, preventing another process from assigning a task to the same person.
    - If no free person is found, **COMMIT** and end the cycle.
    - Find the oldest pending task: `SELECT * FROM qc_tasks WHERE status = 'PENDING' ORDER BY created_at LIMIT 1 FOR UPDATE;`
      - This locks the task row to prevent it from being assigned to someone else.
    - If no pending task is found, **COMMIT** and end the cycle.
    - **If both are found**:
      - Update the person: `SET is_busy = TRUE`.
      - Update the task: `SET status = 'IN_PROGRESS', assigned_to_id = person.id`.
      - Create a record in the `qc_assignments` table.
    - **COMMIT the transaction.** If any step fails, the transaction is rolled back, and no partial changes are saved.

---

## **API Endpoints**

| Method | Path                               | Description                                                       |
| :----- | :--------------------------------- | :---------------------------------------------------------------- |
| `POST` | `/personnel/login`                 | Logs a user in by `person_id`. Sets `is_logged_in=TRUE`.          |
| `POST` | `/personnel/{person_id}/logout`    | Explicitly logs a user out.                                       |
| `POST` | `/personnel/{person_id}/heartbeat` | Updates the `last_heartbeat` timestamp to keep the session alive. |
| `POST` | `/tasks`                           | Allows an admin to create a new QC task.                          |
| `POST` | `/tasks/{task_id}/complete`        | Marks a task as completed and frees up the assigned user.         |
| `GET`  | `/personnel/status`                | Retrieves the status of all logged-in personnel.                  |
| `GET`  | `/tasks/queue`                     | Returns a list of all pending and in-progress tasks.              |
