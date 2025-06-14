import Cell from "./Cell";

export default function CrosswordGrid({
  puzzle,
  entries,
  setEntries,
  selectedCell,
  setSelectedCell,
  direction,
  setDirection,
  setActiveClue,
  feedback, // <-- Accept feedback
}) {
  const handleKeyDown = (e, row, col) => {
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    const val = e.key.toUpperCase();
    let newEntries = entries.map((r) => r.slice());
    newEntries[row][col] = val;
    setEntries(newEntries);

    if (direction === "across") setSelectedCell({ row, col: col + 1 });
    else setSelectedCell({ row: row + 1, col });
  };

  return (
    <div className="grid">
      {puzzle.grid.map((rowArr, rowIdx) => (
        <div className="grid-row" key={rowIdx}>
          {rowArr.map((cell, colIdx) => (
            <Cell
              key={colIdx}
              row={rowIdx}
              col={colIdx}
              cell={cell}
              value={entries[rowIdx][colIdx]}
              isSelected={
                selectedCell.row === rowIdx && selectedCell.col === colIdx
              }
              feedback={feedback?.[rowIdx]?.[colIdx] || null} // <-- NEW
              onClick={() => setSelectedCell({ row: rowIdx, col: colIdx })}
              onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
