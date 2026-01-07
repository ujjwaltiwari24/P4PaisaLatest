import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./mathCaptcha.css";

const DAILY_LIMIT = 10;
const REWARD = 10;
const todayDate = () => new Date().toISOString().slice(0, 10);

export default function MathCaptcha({ userData, onSolved }) {
  const today = todayDate();

  /* ================= LOCAL STATE ================= */
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  // 🔒 SOURCE OF TRUTH (LOCAL)
  const [solvedCount, setSolvedCount] = useState(0);

  /* ================= INIT (RUN ONLY ON OPEN) ================= */
  useEffect(() => {
    const initialCount =
      userData.lastCaptchaDate === today
        ? userData.captchaSolvedToday || 0
        : 0;

    setSolvedCount(initialCount);
    generateQuestion();
    // ⚠️ IMPORTANT: run ONLY ONCE
    // eslint-disable-next-line
  }, []);

  const remaining = DAILY_LIMIT - solvedCount;

  /* ================= HELPERS ================= */
  const generateQuestion = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setAnswer("");
  };

  /* ================= SUBMIT ================= */
  const submitAnswer = async () => {
    if (remaining <= 0) {
      setMessage("Daily limit reached. Come back tomorrow.");
      return;
    }

    if (parseInt(answer, 10) !== num1 + num2) {
      setMessage("❌ Wrong answer. Try again.");
      generateQuestion();
      return;
    }

    const newCount = solvedCount + 1;

    try {
      // 🔥 FIRESTORE UPDATE
      await updateDoc(doc(db, "users", userData.uid), {
        captchaSolvedToday: newCount,
        lastCaptchaDate: today,
        balance: userData.balance + REWARD,
      });

      // 🔥 LOCAL STATE UPDATE (REAL FIX)
      setSolvedCount(newCount);

      // 🔥 Update balance in App.js
      onSolved();

      setMessage(`✅ Correct! +${REWARD} coins`);
      generateQuestion();
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="captcha-card">
      <h3>Math Captcha</h3>

      <p className="captcha-sub">
        Solve simple math & earn <strong>10 coins</strong>
      </p>

      <div className="captcha-question-box">
        {num1} + {num2} = ?
      </div>

      <input
        type="number"
        className="captcha-input"
        placeholder="Enter answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      {message && (
        <div
          className={`captcha-msg ${
            message.includes("Correct") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* PROGRESS */}
      <div className="captcha-progress">
        <div
          className="captcha-progress-bar"
          style={{
            width: `${(solvedCount / DAILY_LIMIT) * 100}%`,
          }}
        />
      </div>

      <p className="captcha-limit-text">
        Solved today: {solvedCount} / {DAILY_LIMIT}
      </p>

      <button
        className="p4-btn full"
        onClick={submitAnswer}
        disabled={remaining <= 0}
      >
        {remaining > 0 ? "Submit Answer" : "Limit Reached"}
      </button>
    </div>
  );
}
