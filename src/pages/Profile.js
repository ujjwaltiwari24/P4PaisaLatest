import "./profile.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import Withdraw from "./Withdraw";

export default function Profile({ userData, goHome }) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const logout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  // 1000 coins = 10 rs conversion
  const rupeeValue = (userData.balance / 1000 * 10).toFixed(2);

  const handleOpenWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleCloseWithdraw = () => {
    setShowWithdrawModal(false);
  };

  if (showWithdrawModal) {
    return <Withdraw userData={userData} goBack={handleCloseWithdraw} />;
  }

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

        {/* BALANCE SECTION */}
        <div className="profile-balance">
          <div className="balance-top">
            <p className="balance-label">Your Balance</p>
            <span className="balance-badge">Active</span>
          </div>
          <p className="balance-value">
            {userData.balance} <span>Coins</span>
          </p>
          <p className="balance-equivalent">= ₹{rupeeValue}</p>
          <p className="balance-info">1000 coins = ₹10</p>
        </div>

        {/* WITHDRAW BUTTON */}
        <button
          className="withdraw-btn full active"
          onClick={handleOpenWithdraw}
        >
          <span className="btn-icon">↑</span>
          Withdraw Now
        </button>

        {/* DIVIDER */}
        <div className="profile-divider"></div>

        {/* ACTIONS */}
        <div className="profile-actions">
          <button className="action-btn" onClick={goHome}>
            <span className="btn-icon">⌂</span>
            <span>Back to Dashboard</span>
          </button>

          <button className="action-btn danger" onClick={logout}>
            <span className="btn-icon">⊗</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}