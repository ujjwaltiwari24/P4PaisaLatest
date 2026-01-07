import "./profile.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Profile({ userData, withdrawConfig, goHome }) {
  const logout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const withdrawEnabled = withdrawConfig?.enabled === true;
  const minCoins = withdrawConfig?.minCoins || 0;

  const canWithdraw =
    withdrawEnabled && userData.balance >= minCoins;

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {userData.name?.charAt(0) || "U"}
          </div>
          <h2 className="profile-name">{userData.name}</h2>
          <p className="profile-email">{userData.email}</p>
        </div>

        {/* BALANCE */}
        <div className="profile-balance">
          <p className="balance-label">Total Balance</p>
          <p className="balance-value">
            {userData.balance} <span>Coins</span>
          </p>
        </div>

        {/* WITHDRAW INFO */}
        {withdrawConfig && (
          <div className="withdraw-box">
            <p>
              Value of 1 coin: <strong>₹{withdrawConfig.coinValue}</strong>
            </p>
            <p>
              Minimum Withdraw:{" "}
              <strong>{withdrawConfig.minCoins} Coins</strong>
            </p>

            {!withdrawEnabled && (
              <p className="withdraw-note">
                {withdrawConfig.message}
              </p>
            )}
          </div>
        )}

        {/* WITHDRAW BUTTON */}
        <button
          className={`p4-btn full ${canWithdraw ? "" : "secondary"}`}
          disabled={!canWithdraw}
          onClick={() => {
            if (!canWithdraw) return;
            alert("Withdraw request feature will be enabled soon 🚀");
          }}
        >
          {withdrawEnabled
            ? canWithdraw
              ? "Request Withdraw"
              : "Minimum Balance Not Met"
            : "Withdraw Disabled"}
        </button>

        {/* ACTIONS */}
        <div className="profile-actions">
          <button className="p4-btn full" onClick={goHome}>
            Back to Dashboard
          </button>

          <button className="p4-btn danger full" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
