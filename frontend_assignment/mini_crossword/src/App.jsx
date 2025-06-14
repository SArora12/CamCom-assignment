import { useState } from "react";
import ClueList from "./components/ClueList";
import Controls from "./components/Controls";
import CrosswordGrid from "./components/CrosswordGrid";
import "./index.css";
import { puzzle } from "./puzzle";

export default function App() {
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState("across");
  const [entries, setEntries] = useState(
    Array(puzzle.rows)
      .fill()
      .map(() => Array(puzzle.cols).fill(""))
  );
  const [feedback, setFeedback] = useState(
    Array(puzzle.rows)
      .fill()
      .map(() => Array(puzzle.cols).fill(null))
  );
  const [activeClue, setActiveClue] = useState({
    direction: "across",
    number: 1,
  });

  function handleReveal() {
    const newEntries = puzzle.grid.map((row) =>
      row.map((cell) =>
        cell && !cell.isBlack && cell.solution ? cell.solution : ""
      )
    );
    setEntries(newEntries);
    setFeedback(
      Array(puzzle.rows)
        .fill()
        .map(() => Array(puzzle.cols).fill(null))
    );
  }

  function handleClear() {
    setEntries(
      Array(puzzle.rows)
        .fill()
        .map(() => Array(puzzle.cols).fill(""))
    );
    setFeedback(
      Array(puzzle.rows)
        .fill()
        .map(() => Array(puzzle.cols).fill(null))
    );
  }

  // ------ NEW: handleCheck ------
  function handleCheck() {
    const newFeedback = puzzle.grid.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (!cell || cell.isBlack || !cell.solution) return null;
        if (!entries[rIdx][cIdx]) return null; // Not filled yet
        return entries[rIdx][cIdx].toUpperCase() === cell.solution.toUpperCase()
          ? "correct"
          : "incorrect";
      })
    );
    setFeedback(newFeedback);
  }
  // -----------------------------

  return (
    <div className="app-main">
      <div className="crossword-main-panel">
        <h2 className="title">Mini Crossword</h2>
        <CrosswordGrid
          puzzle={puzzle}
          entries={entries}
          setEntries={setEntries}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          direction={direction}
          setDirection={setDirection}
          setActiveClue={setActiveClue}
          feedback={feedback}
        />
        <Controls
          onReveal={handleReveal}
          onCheck={handleCheck}
          onClear={handleClear}
        />
      </div>
      <div className="clue-panel-2col">
        <ClueList
          puzzle={puzzle}
          activeClue={activeClue}
          setActiveClue={setActiveClue}
          setDirection={setDirection}
          setSelectedCell={setSelectedCell}
        />
      </div>
    </div>
  );
}
