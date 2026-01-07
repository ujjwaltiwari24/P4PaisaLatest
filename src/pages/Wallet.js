function Wallet({ balance }) {
  return (
    <div className="p4-card">
      <div className="p4-card-title">Wallet</div>
      <div className="p4-balance">{balance} Coins</div>

      <p className="p4-label" style={{ marginTop: "10px" }}>
        Balance is updated in real-time from your account.
      </p>
    </div>
  );
}

export default Wallet;
