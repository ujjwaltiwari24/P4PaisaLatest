import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

const AD_LINK = "https://otieu.com/4/10343013";
const DAILY_AD_LIMIT = 10;
const COINS_PER_AD = 10;

const today = () => new Date().toISOString().slice(0, 10);

export default function WatchAds({ userData, onAdReward }) {
  const [watched, setWatched] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 🔄 SYNC FROM FIREBASE */
  const syncAds = async () => {
    const ref = doc(db, "users", userData.uid);
    const snap = await getDoc(ref);
    const data = snap.data() || {};

    const currentDate = today();
    let ads = Number(data.adsWatchedToday) || 0;

    // Reset if new day OR corrupted value
    if (
      data.lastAdDate !== currentDate ||
      ads < 0 ||
      ads > DAILY_AD_LIMIT
    ) {
      await updateDoc(ref, {
        adsWatchedToday: 0,
        lastAdDate: currentDate,
      });
      ads = 0;
    }

    setWatched(ads);
    setLimitReached(ads >= DAILY_AD_LIMIT);
    setLoading(false);
  };

  useEffect(() => {
    syncAds();
    // eslint-disable-next-line
  }, []);

  /* ▶ WATCH AD + REWARD */
  const watchAd = async () => {
    if (limitReached) return;

    const ref = doc(db, "users", userData.uid);
    const newCount = watched + 1;

    await updateDoc(ref, {
      adsWatchedToday: increment(1),
      lastAdDate: today(),
      balance: increment(COINS_PER_AD),
    });

    // 🔥 INSTANT UI UPDATE
    setWatched(newCount);
    setLimitReached(newCount >= DAILY_AD_LIMIT);
    onAdReward(COINS_PER_AD);

    window.open(AD_LINK, "_blank");
  };

  if (loading) return null;

  return (
    <div className="watch-ads-card">
      <h3>Watch Ads & Earn</h3>

      <p className="watch-info">
        Ads watched today: <b>{watched}</b> / {DAILY_AD_LIMIT}
      </p>

      <p className="watch-info">
        Reward: <b>{COINS_PER_AD} coins</b> per ad
      </p>

      {limitReached ? (
        <p className="limit-text">
          Daily ad limit reached. Come back tomorrow.
        </p>
      ) : (
        <button className="p4-btn full" onClick={watchAd}>
          Watch Ad
        </button>
      )}
    </div>
  );
}
