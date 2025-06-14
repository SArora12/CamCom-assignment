export default function Controls({ onReveal, onCheck, onClear }) {
  return (
    <div className="controls">
      <button onClick={onReveal}>Reveal</button>
      <button onClick={onCheck}>Check</button>
      <button onClick={onClear}>Clear</button>
    </div>
  );
}
