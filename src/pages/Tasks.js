function Tasks({ addBalance }) {
  return (
    <div className="p4-card">
      <div className="p4-card-title">Tasks</div>

      <div className="p4-actions">
        <div className="p4-card">
          <div className="p4-card-title">Solve Task</div>
          <button
            className="p4-btn"
            onClick={() => addBalance(3)}
          >
            Solve & Earn
          </button>
        </div>

        <div className="p4-card">
          <div className="p4-card-title">Watch Ad</div>
          <button
            className="p4-btn"
            onClick={() => addBalance(2)}
          >
            Watch & Earn
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
