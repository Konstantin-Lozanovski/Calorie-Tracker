const MacroProgress = ({ label, current, goal, color }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="macro-progress">
      <div className="macro-label">{label}: {current} / {goal}</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, background: color }}
        ></div>
      </div>
    </div>
  );
};

export default MacroProgress;