import "./dashboard.css";

export default function Dashboard({
  userData,
  claimDailyBonus,
  openStreak,
  openSpin,
  openWatchAds,
  openCaptcha,
  openRefer, // ✅ FIXED
}) {
  const today = new Date().toISOString().slice(0, 10);
  const claimed = userData.lastClaimDate === today;

  return (
    <>
      {/* HERO */}
      <section className="dash-section">
        <div className="hero-card">
          <div className="hero-left">
            <h2>Welcome to Money Share, {userData.name}</h2>
            <p>
              Earn coins daily by completing simple tasks like watching ads,
              spinning the wheel, and maintaining your streak.
            </p>
          </div>

          <div className="hero-balance">
            <span>Your Current Balance</span>
            <strong>{userData.balance}</strong>
            <small>Coins</small>
          </div>
        </div>
      </section>

      {/* DAILY BONUS */}
      <section className="dash-section">
        <div className="daily-card">
          <div className="daily-info">
            <span className="daily-badge">Daily Bonus</span>
            <p>
              Claim your daily reward and increase your streak to unlock higher
              bonuses every day.
            </p>
          </div>

          <div className="daily-actions">
            <button
              className={`p4-btn ${claimed ? "success" : ""}`}
              disabled={claimed}
              onClick={claimDailyBonus}
            >
              {claimed ? "Claimed Today" : "Claim Now"}
            </button>

            <button className="p4-btn secondary" onClick={openStreak}>
              View Streak Calendar
            </button>
          </div>
        </div>
      </section>

      {/* EARNING METHODS */}
      <section className="dash-section">
        <div className="section-header">
          <h3>Ways to Earn Coins</h3>
          <p>Complete tasks, stay consistent, and grow your balance.</p>
        </div>

        <div className="earn-grid">
          <EarnCard
            type="spin"
            title="Spin Wheel"
            desc="Spin the wheel and get random coin rewards instantly."
            onClick={openSpin}
          />

          <EarnCard
            type="ads"
            title="Watch Ads"
            desc="Watch sponsored ads and earn coins."
            onClick={openWatchAds}
          />

          <EarnCard
            type="captcha"
            title="Solve Captcha"
            desc="Solve simple math challenges and earn coins."
            onClick={openCaptcha}
          />

          {/* ✅ FIXED REFER */}
          <EarnCard
            type="refer"
            title="Refer & Earn"
            desc="Invite friends and earn bonus coins."
            onClick={openRefer}
          />
        </div>
      </section>

      {/* ABOUT */}
      <section className="dash-section">
        <div className="about-box">
          <h3>About Money Share</h3>
          <p className="about-subtitle">
            A transparent rewards platform designed for consistent daily earning.
          </p>

          <div className="about-text-block">
            <p>
              <strong>Money Share</strong> is an online earning platform where
              users earn coins by completing simple digital tasks.
            </p>

            <p>
              Revenue is generated through ads and shared fairly with active
              users based on participation.
            </p>

            <p>
              No hidden tricks. Everything is system-driven and transparent.
            </p>
          </div>

          <div className="about-trust">
            <span>✔ Transparent rewards</span>
            <span>✔ Secure accounts</span>
            <span>✔ Daily earning</span>
            <span>✔ Beginner friendly</span>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================= EARN CARD ================= */

function EarnCard({ type, title, desc, onClick }) {
  return (
    <div className="earn-card" onClick={onClick}>
      <div className={`earn-icon ${type}`} />
      <h4>{title}</h4>
      <p>{desc}</p>

      <button className="earn-btn">Start</button>
    </div>
  );
}
