import { useEffect, useRef } from "react";

export default function Cell({
  cell,
  value,
  isSelected,
  feedback,
  onClick,
  onKeyDown,
}) {
  const inputRef = useRef();

  useEffect(() => {
    if (isSelected && inputRef.current) inputRef.current.focus();
  }, [isSelected]);

  if (cell.isBlack) return <div className="cell black"></div>;

  let classNames = "cell";
  if (isSelected) classNames += " selected";
  if (feedback) classNames += ` ${feedback}`;

  return (
    <div className={classNames} onClick={onClick}>
      {cell.number && <span className="cell-number">{cell.number}</span>}
      <input
        ref={inputRef}
        className="cell-input"
        type="text"
        maxLength={1}
        value={value}
        onChange={() => {}}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
    </div>
  );
}
