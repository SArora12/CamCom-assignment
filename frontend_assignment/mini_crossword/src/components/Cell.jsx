import { useEffect, useRef } from "react";

export default function Cell({
  cell,
  value,
  isSelected,
  feedback, // <-- Accept feedback
  onClick,
  onKeyDown,
  row,
  col,
}) {
  const inputRef = useRef();

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  if (cell.isBlack) {
    return <div className="cell black"></div>;
  }

  // Add classes for feedback
  let classNames = "cell";
  if (isSelected) classNames += " selected";
  if (feedback === "correct") classNames += " correct";
  else if (feedback === "incorrect") classNames += " incorrect";

  return (
    <div className={classNames} onClick={onClick} tabIndex={0}>
      {cell.number && <span className="cell-number">{cell.number}</span>}
      <input
        ref={inputRef}
        className="cell-input"
        type="text"
        maxLength={1}
        value={value}
        onChange={() => {}} // handled onKeyDown
        onKeyDown={onKeyDown}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
