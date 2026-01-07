import "./footer.css";

export default function Footer() {
  return (
    <footer className="ms-footer">
      <div className="ms-footer-container">
        {/* BRAND */}
        <div className="ms-footer-brand">
          <h3>Money Share</h3>
          <p>
            Money Share is a reward-based earning platform where users earn coins
            by completing simple tasks like watching ads and daily activities.
          </p>
        </div>

        {/* LEGAL */}
        <div className="ms-footer-col">
          <h4>Legal</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/disclaimer">Disclaimer</a>
        </div>

        {/* COMMUNITY */}
        <div className="ms-footer-col">
          <h4>Community</h4>
          <a
            href="https://t.me/yourtelegram"
            target="_blank"
            rel="noreferrer"
          >
            Telegram Channel
          </a>
          <a
            href="https://wa.me/yourwhatsapp"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Group
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>

      <div className="ms-footer-bottom">
        © {new Date().getFullYear()} Money Share. All rights reserved.
      </div>
    </footer>
  );
}
