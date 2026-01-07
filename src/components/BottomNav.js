function BottomNav({ page, setPage }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "tasks", label: "Tasks" },
    { id: "wallet", label: "Wallet" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="p4-bottom-nav">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setPage(t.id)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: page === t.id ? "#7f5bff" : "#b6b9e6",
            fontSize: "12px",
            fontWeight: page === t.id ? "600" : "400",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default BottomNav;
