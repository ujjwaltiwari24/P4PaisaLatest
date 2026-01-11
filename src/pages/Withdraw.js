import { useState } from "react";
import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./withdraw.css";

export default function Withdraw({ userData, goBack }) {
  console.log("🎯 Withdraw component mounted with userData:", userData);
  
  const [step, setStep] = useState("methods");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [contactInfo, setContactInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const withdrawOptions = [
    { id: "playstore", name: "Google Play", icon: "🎮" },
    { id: "upi", name: "UPI Payment", icon: "💳" },
    { id: "amazon", name: "Amazon Gift Card", icon: "🛍️" },
  ];

  const amountOptions = [
    { coins: 1250, rupees: 10 },
    { coins: 5500, rupees: 50 },
    { coins: 10000, rupees: 100 },
  ];

  const handleMethodClick = (method) => {
    console.log("🔘 Method clicked:", method.name);
    setSelectedMethod(method);
    setStep("amount");
    console.log("📍 Step changed to: amount");
  };

  const handleAmountClick = (amount) => {
    console.log("🔘 Amount clicked:", amount.rupees);
    setSelectedAmount(amount);
    setStep("contact");
    console.log("📍 Step changed to: contact");
  };

  const handleSubmit = async () => {
    console.log("📤 Submit clicked");
    
    if (!contactInfo.trim()) {
      setError("Please enter your contact info");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      console.log("👤 Current user:", currentUser?.email);

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // 1. Add to withdraw_requests collection
      console.log("📝 Creating withdrawal request...");
      const withdrawalData = {
        name: userData.name || "User",
        email: userData.email || currentUser.email,
        amount: selectedAmount.rupees,
        coins: selectedAmount.coins,
        status: "pending",
        createdAt: Timestamp.now(),
        method: selectedMethod.id,
        methodName: selectedMethod.name,
        upiId: selectedMethod.id === "upi" ? contactInfo : null,
        googlePlayEmail: selectedMethod.id === "playstore" ? contactInfo : null,
        amazonEmail: selectedMethod.id === "amazon" ? contactInfo : null,
      };

      const withdrawRef = await addDoc(
        collection(db, "withdraw_requests"),
        withdrawalData
      );
      console.log("✅ Withdrawal request created:", withdrawRef.id);

      // 2. Deduct coins from user balance
      console.log("💰 Deducting", selectedAmount.coins, "coins from user balance");
      const userDocRef = doc(db, "users", currentUser.uid);
      const newBalance = userData.balance - selectedAmount.coins;
      
      await updateDoc(userDocRef, {
        balance: newBalance,
      });
      console.log("✅ Balance updated. New balance:", newBalance);

      // Success
      setStep("success");
      console.log("🎉 Withdrawal process complete!");

      setTimeout(() => {
        console.log("🔄 Redirecting back to profile...");
        goBack();
      }, 3000);

    } catch (err) {
      console.error("❌ Error:", err);
      setError("Error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (step === "success") {
    return (
      <div className="withdraw-container">
        <div className="withdraw-modal success">
          <div className="success-icon">✓</div>
          <h2>Request Submitted!</h2>
          <p>₹{selectedAmount.rupees} withdrawal request created</p>
          <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px'}}>
            Coins deducted: {selectedAmount.coins}
          </p>
        </div>
      </div>
    );
  }

  // Contact Screen
  if (step === "contact") {
    console.log("🖥️ Rendering contact screen");
    
    return (
      <div className="withdraw-container">
        <div className="withdraw-modal">
          <button className="close-btn" onClick={() => setStep("amount")}>
            ← Back
          </button>
          <h2>Enter Details</h2>
          
          <div className="withdraw-summary">
            <div className="summary-item">
              <span>Amount:</span>
              <strong>₹{selectedAmount.rupees}</strong>
            </div>
            <div className="summary-item">
              <span>Coins:</span>
              <strong>{selectedAmount.coins}</strong>
            </div>
          </div>

          <div className="form-group">
            <label>{selectedMethod.id === "upi" ? "UPI ID" : "Email"}</label>
            <input
              type={selectedMethod.id === "upi" ? "text" : "email"}
              placeholder={selectedMethod.id === "upi" ? "name@upi" : "email@example.com"}
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit Request"}
          </button>
        </div>
      </div>
    );
  }

  // Amount Screen
  if (step === "amount") {
    console.log("🖥️ Rendering amount screen");
    
    return (
      <div className="withdraw-container">
        <div className="withdraw-modal">
          <button className="close-btn" onClick={() => setStep("methods")}>
            ← Back
          </button>
          <h2>Select Amount</h2>
          <p style={{color: '#2ecc71', textAlign: 'center', marginBottom: '20px'}}>
            {selectedMethod.icon} {selectedMethod.name}
          </p>

          <div className="amounts-grid">
            {amountOptions.map((amount) => {
              const canWithdraw = userData.balance >= amount.coins;
              return (
                <button
                  key={amount.rupees}
                  className={`amount-btn ${!canWithdraw ? "disabled" : ""}`}
                  disabled={!canWithdraw}
                  onClick={() => handleAmountClick(amount)}
                >
                  <div className="amount-value">₹{amount.rupees}</div>
                  <div className="amount-coins">{amount.coins} coins</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Methods Screen
  console.log("🖥️ Rendering methods screen");
  
  return (
    <div className="withdraw-container">
      <div className="withdraw-modal">
        <button className="close-btn" onClick={goBack}>
          ← Back
        </button>
        <h2>Withdraw Earnings</h2>
        
        <div className="balance-info">
          <p>Balance: <strong>{userData.balance} Coins</strong></p>
          <p style={{fontSize: '12px', marginTop: '5px'}}>
            = ₹{(userData.balance / 1000 * 10).toFixed(2)}
          </p>
        </div>

        <p className="step-title">Choose Method</p>

        <div className="methods-grid">
          {withdrawOptions.map((method) => (
            <button
              key={method.id}
              className="method-btn"
              onClick={() => handleMethodClick(method)}
            >
              <div className="method-icon">{method.icon}</div>
              <p className="method-title">{method.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}