import { useEffect, useState } from "react";
import "./dailyStreak.css";

const DAILY_REWARDS = [10, 30, 70, 150, 400, 600, 1000];

export default function DailyStreak({ userData, close }) {
  // Get current streak, ensuring it's reset if not claimed today
  const getCurrentStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    const lastClaimDate = userData.lastClaimDate;

    // If user claimed today, show their current streak
    if (lastClaimDate === today) {
      return Math.max(0, Math.min(userData.dailyStreak || 0, 7));
    }

    // If streak was supposed to be claimed yesterday but wasn't, reset to 0
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (lastClaimDate !== yesterday) {
      console.log("⚠️ Streak broken! User didn't claim yesterday");
      return 0;
    }

    // If user is claiming today (continuing streak), show current streak
    return Math.max(0, Math.min(userData.dailyStreak || 0, 7));
  };

  const streak = getCurrentStreak();
  const [fillPercent, setFillPercent] = useState(0);

  /* Animate progress bar */
  useEffect(() => {
    setFillPercent(0);
    const t = setTimeout(() => {
      setFillPercent((streak / 7) * 100);
    }, 120);
    return () => clearTimeout(t);
  }, [streak]);

  return (
    <div className="ds-wrapper">
      {/* HEADER */}
      <div className="ds-header">
        <div>
          <h3>Daily Bonus</h3>
          <p className="ds-streak-info">Current Streak: {streak}/7 Days</p>
        </div>
        <button className="ds-close" onClick={close}>✕</button>
      </div>

      {/* TIMELINE */}
      <div className="ds-timeline">
        {/* PROGRESS BAR */}
        <div className="ds-bar">
          <div
            className="ds-bar-fill"
            style={{ height: `${fillPercent}%` }}
          />
        </div>

        {/* DAYS */}
        <div className="ds-days">
          {DAILY_REWARDS.map((reward, index) => {
            const day = index + 1;

            // Determine the state of each day
            const completed = day <= streak;
            const current = day === streak + 1 && streak < 7;
            const locked = day > streak + 1;

            return (
              <div
                key={day}
                className={`ds-day-card
                  ${completed ? "completed" : ""}
                  ${current ? "today" : ""}
                  ${locked ? "locked" : ""}
                `}
              >
                <div className="ds-day-circle">
                  {completed ? "✔" : locked ? "🔒" : day}
                </div>

                <div className="ds-day-info">
                  <div className="ds-day-title">
                    Day {day}
                  </div>
                  <div className="ds-day-reward">
                    +{reward} Coins
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STREAK WARNING */}
      {streak === 0 && (
        <div className="ds-warning">
          <p>⚠️ <strong>Streak Reset!</strong> Start from Day 1 again. Claim daily to build your streak.</p>
        </div>
      )}

      {/* FOOTER HINT */}
      <p className="ds-hint">
        {streak === 7 
          ? "🎉 You've completed the full streak! Start a new one tomorrow."
          : "Miss a day and your streak resets. Claim daily to reach Day 7 rewards."
        }
      </p>
    </div>
  );
}