# Near Neighbor Remover

## Overview

`Near Neighbor Remover` is a utility that filters a sequence of 2D points, removing any point that lies within a specified Euclidean distance threshold from the last retained point.

1. The main remover implementation (`near_neighbor_remover.py`).
2. Test data and expected output definitions (`data.py`).
3. A self‑verifying script that asserts correctness and prints the filtered points.

---

## My Approach and Thought Process

**1. Deconstructing the Requirements:**
First, I identified the core requirements from the problem description:

- A Python class named `NearNeighborRemover`.
- An initializer that accepts a `distance_threshold`.
- A method to calculate the Euclidean distance between two points.
- A primary method to filter a list of points based on their distance from the _previously kept point_, not just their immediate predecessor in the input list.

**2. Designing the Core Algorithm:**
My main focus was on the filtering logic. The key was to maintain a separate list of points that have passed the filter, as the distance check is always against the last member of this valid list. The algorithm is as follows:

- If the input list is empty, return an empty list immediately.
- Create a new list, `filtered_points`, and initialize it with the very first point from the input. This point is always included as it has no predecessor to be compared against.
- Iterate through the original `points` list, starting from the second point.
- For each `current_point`, calculate its Euclidean distance to the last point in our `filtered_points` list (`filtered_points[-1]`).
- If the calculated distance is greater than or equal to the `distance_threshold`, append the `current_point` to `filtered_points`. Otherwise, discard it.
- Once the loop is complete, `filtered_points` holds the desired result.

**3. Choosing the Right Tools:**
For the distance calculation, I chose `math.hypot(dx, dy)`. While `math.sqrt(dx**2 + dy**2)` also works, `math.hypot` is generally preferred as it provides better numerical stability and avoids potential overflow issues when dealing with very large coordinate values.

**4. Encapsulation and Verification:**
Finally, I encapsulated all the logic within the `NearNeighborRemover` class as required. To ensure correctness, I created a self-verifying script within the `if __name__ == "__main__":` block. This script instantiates the class, runs the filtering process on the provided data, and uses an `assert` statement to confirm that the output exactly matches the expected result given in the problem description. This makes the solution runnable and instantly verifiable.

---

## Directory Structure

```
near_neighbor/
├── data.py               # Contains `data` (input points) and `output` (expected result)
├── near_neighbor_remover.py  # Main script with `NearNeighborRemover` class
└── README.md             # This documentation file
```

---

## Requirements

- Python 3.9+

No external dependencies beyond the standard library.

---

## Installation

Clone the repo and install (if needed) in a virtual environment:

```bash
git clone https://github.com/SArora12/CamCom-assignment.git
cd backend_assignment
cd near_neighbor
```

---

## Usage

Run the script directly to apply the filter and verify correctness:

```bash
python near_neighbor_remover.py
```

This will:

1. Load `data` from `data.py`.
2. Filter points using a threshold of 10.0 units.
3. Assert that the result matches the expected `output`.
4. Print each retained point.

Example output:

```
Output matches expected filtered points.
Filtered points:
[736.8749389648438, 592.4999389648438]
[725.6249389648438, 598.1249389648438]
[834.3749389648438, 594.3749389648438]
```

---

## Code Structure

### `NearNeighborRemover`

- **Constructor**: `__init__(distance_threshold: float)`

  - Initializes the instance with the minimum allowed distance between successive points.

- **`calculate_distance(point1, point2) -> float`**

  - Computes Euclidean distance:

    ```python
    dx = point2[0] - point1[0]
    dy = point2[1] - point1[1]
    return math.hypot(dx, dy)
    ```

  - Uses `math.hypot` for numeric stability.
  - `math.hypot(x, y)` returns the Euclidean distance from the origin to the point (x, y), i.e sqrt{x^2 + y^2}. It does so using a numerically stable algorithm to avoid overflow or underflow when x and/or y are very large or very small.

- **`remove_near_neighbors(points) -> List[List[float]]`**

  - Takes a list of `[x, y]` points.
  - Initializes `filtered` with the first point.
  - Iterates remaining points, keeping each only if its distance
    from `filtered[-1]` is **≥** `distance_threshold`.
  - Returns the filtered list.

### Script Execution (`__main__`)

1. Instantiates `NearNeighborRemover` with `distance_threshold = 10.0`.
2. Calls `remove_near_neighbors(data)`.
3. Uses `assert result == output` to auto-verify correctness.

   - Raises an error if values differ.

4. Prints confirmation and lists the filtered points.

---

## Testing & Verification

The script is self‑validating.

```python
from near_neighbor_remover import NearNeighborRemover
from data import data, output

remover = NearNeighborRemover(10.0)
assert remover.remove_near_neighbors(data) == output
```

---
