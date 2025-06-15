import Cell from "./Cell";

export default function CrosswordGrid({
  puzzle,
  entries,
  setEntries,
  selectedCell,
  setSelectedCell,
  direction,
  feedback,
}) {
  const handleKeyDown = (e, row, col) => {
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    const val = e.key.toUpperCase();
    setEntries((prev) => {
      const newEntries = prev.map((rowArr) => [...rowArr]);
      newEntries[row][col] = val;
      return newEntries;
    });

    if (direction === "across") setSelectedCell({ row, col: col + 1 });
    else setSelectedCell({ row: row + 1, col });
  };

  return (
    <div className="grid">
      {puzzle.grid.map((rowArr, rowIdx) => (
        <div className="grid-row" key={rowIdx}>
          {rowArr.map((cell, colIdx) => (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              cell={cell}
              value={entries[rowIdx][colIdx]}
              isSelected={
                selectedCell.row === rowIdx && selectedCell.col === colIdx
              }
              feedback={feedback?.[rowIdx]?.[colIdx]}
              onClick={() => setSelectedCell({ row: rowIdx, col: colIdx })}
              onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
