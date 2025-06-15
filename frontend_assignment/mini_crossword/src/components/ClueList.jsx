export default function ClueList({
  puzzle,
  activeClue,
  setActiveClue,
  setDirection,
}) {
  return (
    <div className="clue-list-2col">
      {["across", "down"].map((dir) => (
        <div key={dir} className="clue-col">
          <div className="clue-header">{dir.toUpperCase()}</div>
          <ul>
            {puzzle[dir].map((clue) => (
              <li
                key={clue.number}
                className={
                  activeClue.direction === dir &&
                  activeClue.number === clue.number
                    ? "clue active"
                    : "clue"
                }
                onClick={() => {
                  setActiveClue({ direction: dir, number: clue.number });
                  setDirection(dir);
                }}
              >
                <b>{clue.number}.</b> {clue.clue}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
