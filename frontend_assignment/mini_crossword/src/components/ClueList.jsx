// ClueList.js
export default function ClueList({
  puzzle,
  activeClue,
  setActiveClue,
  setDirection,
  setSelectedCell,
}) {
  return (
    <div className="clue-list-2col">
      <div className="clue-col">
        <div className="clue-header">ACROSS</div>
        <ul>
          {puzzle.across.map((clue) => (
            <li
              key={clue.number}
              className={
                activeClue.direction === "across" &&
                activeClue.number === clue.number
                  ? "clue active"
                  : "clue"
              }
              onClick={() => {
                setActiveClue({ direction: "across", number: clue.number });
                setDirection("across");
              }}
            >
              <b>{clue.number}.</b> {clue.clue}
            </li>
          ))}
        </ul>
      </div>
      <div className="clue-col">
        <div className="clue-header">DOWN</div>
        <ul>
          {puzzle.down.map((clue) => (
            <li
              key={clue.number}
              className={
                activeClue.direction === "down" &&
                activeClue.number === clue.number
                  ? "clue active"
                  : "clue"
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
    </div>
  );
}
