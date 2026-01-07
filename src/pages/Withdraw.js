import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Withdraw({ userData }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      const snap = await getDoc(doc(db, "appConfig", "withdraw"));
      if (snap.exists()) setConfig(snap.data());
      setLoading(false);
    };
    loadConfig();
  }, []);

  if (loading) return <p>Loading withdraw settings...</p>;

  if (!config.withdrawEnabled) {
    return (
      <div className="withdraw-card">
        <h3>Withdraw Disabled</h3>
        <p>{config.note}</p>
      </div>
    );
  }

  if (userData.balance < config.minCoins) {
    return (
      <div className="withdraw-card">
        <h3>Not Eligible</h3>
        <p>
          Minimum {config.minCoins} coins required.
          <br />
          Your balance: {userData.balance}
        </p>
      </div>
    );
  }

  return (
    <div className="withdraw-card">
      <h3>Withdraw Coins</h3>

      <p>
        Coin Value: <strong>₹{config.coinValue}</strong>
      </p>

      <p>
        Your Balance: <strong>{userData.balance}</strong>
      </p>

      <p>
        Amount: ₹
        {(userData.balance * config.coinValue).toFixed(2)}
      </p>

      <button className="p4-btn full">
        Request Withdrawal
      </button>
    </div>
  );
}
