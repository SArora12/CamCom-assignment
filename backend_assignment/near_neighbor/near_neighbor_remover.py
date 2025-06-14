import math
from typing import List

from near_neighbor.data import data, output


class NearNeighborRemover:
    def __init__(self, distance_threshold: float):
        self.distance_threshold = distance_threshold

    def calculate_distance(self, point1: List[float], point2: List[float]) -> float:
        """Euclidean distance between two points represented as [x, y]."""
        dx = point2[0] - point1[0]
        dy = point2[1] - point1[1]
        # math.sqrt(dx**2 + dy**2)
        return math.hypot(dx, dy)

    def remove_near_neighbors(self, points: List[List[float]]) -> List[List[float]]:
        """
        Return a filtered list of points (as [x, y]) where each point
        is at least `distance_threshold` away from the previously kept point.
        """
        if not points:
            return []
        filtered: List[List[float]] = [points[0]]
        for pt in points[1:]:
            if self.calculate_distance(filtered[-1], pt) >= self.distance_threshold:
                filtered.append(pt)
        return filtered


if __name__ == "__main__":

    remover = NearNeighborRemover(distance_threshold=10.0)
    result = remover.remove_near_neighbors(data)

    # 3. Assert correctness
    assert (
        result == output
    ), f"Assertion failed:\nGot:      {result}\nExpected: {output}"

    print("Output matches expected filtered points.")
    print("Filtered points:")
    for pt in result:
        print(pt)
