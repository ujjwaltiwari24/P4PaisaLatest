import { useEffect, useRef, useState } from "react";
import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

/* ================= CONFIG ================= */

const SECTIONS = 6;
const MAX_REWARD = 30;
const MAX_SPINS_PER_HOUR = 5;
const AD_LINK = "https://otieu.com/4/10343013";

/* Wheel colors */
const COLORS = [
  "#6C63FF",
  "#4D96FF",
  "#00B4D8",
  "#2EC4B6",
  "#FFC857",
  "#FF6B6B",
];

export default function SpinWheel({ userData, onReward, close }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const [canSpin, setCanSpin] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [resetIn, setResetIn] = useState(null);

  const lockRef = useRef(false);
  const sliceAngle = 360 / SECTIONS;

  /* ================= FIRESTORE SYNC ================= */

  const syncFromFirestore = async () => {
    const ref = doc(db, "users", userData.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const now = Date.now();

    let used = data.spinCountHour || 0;
    let start = data.spinHourStart?.toMillis?.() || 0;

    // ⏱ Reset after 1 hour
    if (!start || now - start >= 3600000) {
      await updateDoc(ref, {
        spinCountHour: 0,
        spinHourStart: serverTimestamp(),
      });
      used = 0;
      start = now;
    }

    const remainingSpins = Math.max(
      0,
      MAX_SPINS_PER_HOUR - used
    );

    setRemaining(remainingSpins);
    setResetIn(Math.max(0, 3600000 - (now - start)));

    setCanSpin(
      (data.spinCredits || 0) > 0 && remainingSpins > 0
    );
  };

  useEffect(() => {
    syncFromFirestore();
    // eslint-disable-next-line
  }, []);

  /* ================= COUNTDOWN ================= */

  useEffect(() => {
    if (resetIn === null) return;

    const timer = setInterval(() => {
      setResetIn((prev) => {
        if (prev <= 1000) {
          syncFromFirestore();
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [resetIn]);

  /* ================= WATCH AD ================= */

  const watchAd = async () => {
    const ref = doc(db, "users", userData.uid);

    await updateDoc(ref, {
      spinCredits: increment(1),
    });

    window.open(AD_LINK, "_blank");
    await syncFromFirestore();
  };

  /* ================= SPIN ================= */

  const spin = async () => {
    if (
      !canSpin ||
      spinning ||
      remaining <= 0 ||
      lockRef.current
    )
      return;

    lockRef.current = true;
    setSpinning(true);
    setResult(null);

    const reward = Math.floor(Math.random() * MAX_REWARD) + 1;
    const index = Math.floor(Math.random() * SECTIONS);

    const spins = 360 * (5 + Math.floor(Math.random() * 3));
    const target =
      rotation +
      spins +
      (SECTIONS - index) * sliceAngle -
      sliceAngle / 2;

    setRotation(target);

    setTimeout(async () => {
      const ref = doc(db, "users", userData.uid);

      await updateDoc(ref, {
        balance: increment(reward),
        spinCredits: increment(-1),
        spinCountHour: increment(1),
        spinHourStart: serverTimestamp(),
      });

      /* 🔥 SAFE CALLBACK (MAIN FIX) */
      if (typeof onReward === "function") {
        onReward(reward);
      }

      setResult(reward);
      setSpinning(false);
      lockRef.current = false;

      await syncFromFirestore();
    }, 4500);
  };

  const formatTime = (ms) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}m ${s}s`;
  };

  /* ================= UI ================= */

  return (
    <div className="p4-modal">
      <div className="p4-modal-box spin-svg">
        <h3>Spin & Earn</h3>

        {remaining > 0 ? (
          <p className="spin-info">
            Spins left this hour: <b>{remaining}</b> / {MAX_SPINS_PER_HOUR}
          </p>
        ) : (
          <p className="spin-limit">
            Limit reached. Reset in <b>{formatTime(resetIn)}</b>
          </p>
        )}

        {/* WHEEL */}
        <div className="svg-wheel-wrapper">
          <div className="svg-pointer" />

          <svg
            viewBox="0 0 300 300"
            className="svg-wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4.5s cubic-bezier(.12,.85,.2,1)"
                : "none",
            }}
          >
            <g transform="translate(150,150)">
              {[...Array(SECTIONS)].map((_, i) => {
                const start = (i * 360) / SECTIONS;
                const end = ((i + 1) * 360) / SECTIONS;
                const r = 140;
                const x1 = r * Math.cos((Math.PI * start) / 180);
                const y1 = r * Math.sin((Math.PI * start) / 180);
                const x2 = r * Math.cos((Math.PI * end) / 180);
                const y2 = r * Math.sin((Math.PI * end) / 180);
                const mid = (start + end) / 2;
                const tx = Math.cos((Math.PI * mid) / 180) * 85;
                const ty = Math.sin((Math.PI * mid) / 180) * 85;

                return (
                  <g key={i}>
                    <path
                      d={`M0 0 L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                      fill={COLORS[i]}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#fff"
                      fontSize="28"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      ?
                    </text>
                  </g>
                );
              })}
            </g>

            <circle cx="150" cy="150" r="45" fill="#111" />
            <text
              x="150"
              y="150"
              fill="#fff"
              fontSize="14"
              fontWeight="900"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              SPIN
            </text>
          </svg>
        </div>

        {!canSpin && remaining > 0 && (
          <button className="p4-btn full" onClick={watchAd}>
            Watch Ad to Get Free Spin
          </button>
        )}

        {canSpin && remaining > 0 && (
          <button className="p4-btn full" onClick={spin}>
            {spinning ? "Spinning..." : "Spin Now"}
          </button>
        )}

        {result !== null && (
          <div className="spin-result-svg">
            🎉 You won <b>{result}</b> coins
          </div>
        )}

        <button className="p4-btn secondary full" onClick={close}>
          Close
        </button>
      </div>
    </div>
  );
}