import { useEffect, useState } from "react";
import "./dailyStreak.css";

const DAILY_REWARDS = [10, 30, 70, 150, 400, 600, 1000];

export default function DailyStreak({ userData, close }) {
  const streak = Math.max(0, Math.min(userData.dailyStreak || 0, 7));
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
        <h3>Daily Bonus</h3>
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

      {/* FOOTER HINT */}
      <p className="ds-hint">
        Missing a day and your streak resets. Claim daily to reach Day 7 rewards.
      </p>
    </div>
  );
}
