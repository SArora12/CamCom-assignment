export default function ClueList({
  puzzle,
  activeClue,
  setActiveClue,
  setDirection,
  setSelectedCell,
}) {
  return (
    <div className="clue-list">
      <h3>Across</h3>
      <ul>
        {puzzle.across.map((clue) => (
          <li
            key={clue.number}
            className={
              activeClue.direction === "across" &&
              activeClue.number === clue.number
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveClue({ direction: "across", number: clue.number });
              setDirection("across");
              // Optionally, scroll/select starting cell
              // setSelectedCell({row, col})
            }}
          >
            <b>{clue.number}.</b> {clue.clue}
          </li>
        ))}
      </ul>
      <h3>Down</h3>
      <ul>
        {puzzle.down.map((clue) => (
          <li
            key={clue.number}
            className={
              activeClue.direction === "down" &&
              activeClue.number === clue.number
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveClue({ direction: "down", number: clue.number });
              setDirection("down");
            }}
          >
            <b>{clue.number}.</b> {clue.clue}
          </li>
        ))}
      </ul>
    </div>
  );
}
