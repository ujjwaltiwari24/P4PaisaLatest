import { useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import "./refer.css";

/* ================= UTILS ================= */

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

/* ================= COMPONENT ================= */

export default function Refer({
  userData,
  goBack,
  onReferralApplied,
}) {
  const [myCode, setMyCode] = useState(userData.referralCode || "");
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Lock state (prevent multiple referrals)
  const [locked, setLocked] = useState(
    userData.referralApplied === true
  );

  /* ================= CREATE REFERRAL CODE ================= */

  const createReferralCode = async () => {
    if (myCode) return;

    setLoading(true);
    let code = generateCode();
    let exists = true;

    // Ensure unique code
    while (exists) {
      const q = query(
        collection(db, "users"),
        where("referralCode", "==", code)
      );
      const snap = await getDocs(q);
      if (snap.empty) exists = false;
      else code = generateCode();
    }

    await updateDoc(doc(db, "users", userData.uid), {
      referralCode: code,
    });

    setMyCode(code);
    setLoading(false);
  };

  /* ================= APPLY FRIEND CODE ================= */

  const applyReferral = async () => {
    if (locked || loading) return;

    if (!inputCode || inputCode === myCode) {
      setMessage("Invalid referral code");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "users"),
        where("referralCode", "==", inputCode)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setMessage("❌ Referral code not found");
        setLoading(false);
        return;
      }

      const refUser = snap.docs[0];

      // Give coins to referrer
      await updateDoc(refUser.ref, {
        balance: (refUser.data().balance || 0) + 1000,
      });

      // Give coins to referral and mark as applied
      await updateDoc(doc(db, "users", userData.uid), {
        balance: userData.balance + 500,
        referredBy: inputCode,
        referralApplied: true,
      });

      setLocked(true);
      setMessage("🎉 Referral applied successfully! +500 coins");

      // Callback
      if (typeof onReferralApplied === "function") {
        onReferralApplied();
      }
    } catch (error) {
      console.error("Error applying referral:", error);
      setMessage("❌ Error applying referral. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="refer-page">
      <div className="refer-card">
        {/* HEADER */}
        <div className="refer-header">
          <h2>🤝 Refer & Earn</h2>
          <p>Invite friends and earn rewards together</p>
        </div>

        {/* MY CODE */}
        <div className="refer-section">
          <h4>🎁 Your Referral Code</h4>

          {myCode ? (
            <div className="refer-code-box">{myCode}</div>
          ) : (
            <button
              className="p4-btn full"
              onClick={createReferralCode}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Referral Code"}
            </button>
          )}

          <p className="refer-hint">
            Share this code with friends.  
            You earn <strong>1000 coins</strong> per successful referral.
          </p>
        </div>

        {/* APPLY CODE */}
        {!locked && (
          <div className="refer-section">
            <h4>🧑‍🤝‍🧑 Enter Friend's Code</h4>

            <input
              type="text"
              placeholder="Enter referral code"
              value={inputCode}
              onChange={(e) =>
                setInputCode(e.target.value.toUpperCase())
              }
              className="refer-input"
            />

            <button
              className="p4-btn success full"
              onClick={applyReferral}
              disabled={loading || !inputCode}
            >
              {loading ? "Applying..." : "Apply Code & Earn"}
            </button>

            <p className="refer-hint">
              Your friend earns <strong>500 coins</strong>.  
              You earn <strong>1000 coins</strong>.
            </p>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <div className={`refer-msg ${message.includes("❌") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        {/* SUCCESS STATE */}
        {locked && (
          <div className="refer-success">
            <p>✅ You've already applied a referral code</p>
            <p>You can only use one referral code</p>
          </div>
        )}

        {/* TRUST */}
        <div className="refer-trust">
          <span>✔ One-time referral only</span>
          <span>✔ Coins credited instantly</span>
          <span>✔ No self-referrals allowed</span>
        </div>

        {/* BACK */}
        <button
          className="p4-btn secondary full"
          onClick={goBack}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}