import { useState } from "react";
import ClueList from "./components/ClueList";
import Controls from "./components/Controls";
import CrosswordGrid from "./components/CrosswordGrid";
import "./index.css";
import { puzzle } from "./puzzle";

export default function App() {
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState("across"); // "across" or "down"
  const [entries, setEntries] = useState(
    Array(puzzle.rows)
      .fill()
      .map(() => Array(puzzle.cols).fill(""))
  );
  const [activeClue, setActiveClue] = useState({
    direction: "across",
    number: 1,
  });

  const [feedback, setFeedback] = useState(
    Array(puzzle.rows)
      .fill()
      .map(() => Array(puzzle.cols).fill(null))
  );
  function handleReveal() {
    const newEntries = puzzle.grid.map((row) =>
      row.map((cell) =>
        cell && !cell.isBlack && cell.solution ? cell.solution : ""
      )
    );
    setEntries(newEntries);
    // Optionally, reset feedback
    setFeedback(
      Array(puzzle.rows)
        .fill()
        .map(() => Array(puzzle.cols).fill(null))
    );
  }

  function handleCheck() {
    const newFeedback = puzzle.grid.map((row, r) =>
      row.map((cell, c) => {
        if (!cell || cell.isBlack) return null;
        if (!entries[r][c]) return null;
        if (entries[r][c].toUpperCase() === cell.solution) return "correct";
        return "wrong";
      })
    );
    setFeedback(newFeedback);
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

  return (
    <div className="app-container">
      <h2>Mini Crossword</h2>
      <div className="crossword-wrapper">
        <CrosswordGrid
          puzzle={puzzle}
          entries={entries}
          setEntries={setEntries}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          direction={direction}
          setDirection={setDirection}
          setActiveClue={setActiveClue}
        />
        <ClueList
          puzzle={puzzle}
          activeClue={activeClue}
          setActiveClue={setActiveClue}
          setDirection={setDirection}
          setSelectedCell={setSelectedCell}
        />
      </div>
      <Controls
        onReveal={handleReveal}
        onCheck={handleCheck}
        onClear={handleClear}
      />
    </div>
  );
}
