import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import AuthPage from "./AuthPage";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SpinWheel from "./pages/SpinWheel";
import WatchAds from "./pages/WatchAds";
import DailyStreak from "./pages/DailyStreak";
import MathCaptcha from "./pages/MathCaptcha";
import Refer from "./pages/Refer";
import Footer from "./components/Footer";

import "./theme.css";

/* ================= HELPERS ================= */

const todayDate = () => new Date().toISOString().slice(0, 10);

const DAILY_REWARDS = [10, 30, 70, 150, 400, 600, 1000];

const generateReferralCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

/* ================= APP ================= */

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState("home");

  const [showSpin, setShowSpin] = useState(false);
  const [showWatchAds, setShowWatchAds] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const [loading, setLoading] = useState(true);

  /* ================= AUTH + USER LOAD ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      setUser(u);

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        /* 🔥 NEW USER */
        const data = {
          name: u.displayName || "User",
          email: u.email,
          balance: 0,

          referralCode: generateReferralCode(),
          referralApplied: false,
          referredBy: null,

          dailyStreak: 0,
          lastClaimDate: null,

          captchaSolvedToday: 0,
          lastCaptchaDate: todayDate(),

          createdAt: serverTimestamp(),
        };

        await setDoc(ref, data);
        setUserData(data);
      } else {
        /* 🔁 EXISTING USER */
        const data = snap.data();

        // Safety: referral code generate ONLY once
        if (!data.referralCode) {
          const code = generateReferralCode();
          await updateDoc(ref, { referralCode: code });
          data.referralCode = code;
        }

        setUserData(data);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= DAILY BONUS ================= */

  const claimDailyBonus = async () => {
    if (!userData) return;

    const today = todayDate();
    if (userData.lastClaimDate === today) return;

    let streak = userData.dailyStreak + 1;
    if (streak > 7) streak = 1;

    const reward = DAILY_REWARDS[streak - 1];

    const updated = {
      dailyStreak: streak,
      lastClaimDate: today,
      balance: userData.balance + reward,
    };

    await updateDoc(doc(db, "users", user.uid), updated);
    setUserData((prev) => ({ ...prev, ...updated }));
  };

  /* ================= GUARDS ================= */

  if (loading) {
    return <div className="p4-loading">Loading your account…</div>;
  }

  if (!user) return <AuthPage />;

  if (!userData) {
    return <div className="p4-loading">Preparing dashboard…</div>;
  }

  /* ================= UI ================= */

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="p4-topbar">
        <div
          className="p4-brand"
          onClick={() => setPage("home")}
          style={{ cursor: "pointer" }}
        >
          Money Share
        </div>

        <div className="p4-top-actions">
          <div className="p4-balance-pill">
            {userData.balance} Coins
          </div>

          <button
            className="p4-profile-icon"
            onClick={() => setPage("profile")}
          >
            {userData.name?.charAt(0) || "U"}
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="p4-container">
        {page === "home" && (
          <Dashboard
            userData={userData}
            claimDailyBonus={claimDailyBonus}
            openSpin={() => setShowSpin(true)}
            openWatchAds={() => setShowWatchAds(true)}
            openStreak={() => setShowStreak(true)}
            openCaptcha={() => setShowCaptcha(true)}
            openRefer={() => setPage("refer")}
          />
        )}

        {page === "refer" && (
          <Refer
            userData={{ ...userData, uid: user.uid }}
            goBack={() => setPage("home")}
          />
        )}

        {page === "profile" && (
          <Profile
            userData={userData}
            goHome={() => setPage("home")}
            logout={() => signOut(auth)}
          />
        )}
      </div>

      <Footer />

      {/* ================= MODALS ================= */}
      {showSpin && (
        <SpinWheel
          userData={{ ...userData, uid: user.uid }}
          close={() => setShowSpin(false)}
        />
      )}

      {showWatchAds && (
        <div className="p4-modal">
          <div className="p4-modal-box">
            <WatchAds
              userData={{ ...userData, uid: user.uid }}
              onAdReward={(amt) =>
                setUserData((p) => ({
                  ...p,
                  balance: p.balance + amt,
                }))
              }
            />
            <button
              className="p4-btn secondary full"
              onClick={() => setShowWatchAds(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showStreak && (
        <div className="p4-modal">
          <div className="p4-modal-box">
            <DailyStreak userData={userData} />
            <button
              className="p4-btn secondary full"
              onClick={() => setShowStreak(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCaptcha && (
        <div className="p4-modal">
          <div className="p4-modal-box">
            <MathCaptcha
              userData={{ ...userData, uid: user.uid }}
              onSolved={() =>
                setUserData((prev) => {
                  const today = todayDate();

                  const solved =
                    prev.lastCaptchaDate === today
                      ? prev.captchaSolvedToday || 0
                      : 0;

                  return {
                    ...prev,
                    balance: prev.balance + 10,
                    captchaSolvedToday: solved + 1,
                    lastCaptchaDate: today,
                  };
                })
              }
            />
            <button
              className="p4-btn secondary full"
              onClick={() => setShowCaptcha(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
