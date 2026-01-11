import { useState } from "react";
import "./footer.css";

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const [expandedSection, setExpandedSection] = useState({});

  const toggleSection = (id) => {
    setExpandedSection(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Privacy Policy Sections
  const privacySections = [
    {
      id: 1,
      title: "Information We Collect",
      content: `We collect information you provide directly to us, including your name, email address, phone number, and payment information. We also collect information about your interactions with our platform, including tasks completed, rewards earned, and withdrawal requests.\n\nWe may also collect device information such as IP address, browser type, and operating system to improve our services and prevent fraud.`
    },
    {
      id: 2,
      title: "How We Use Your Information",
      content: `We use your information to:\n• Process your earnings and manage withdrawals\n• Verify your identity and prevent fraudulent activities\n• Improve our platform and user experience\n• Send you important updates and notifications\n• Comply with legal requirements\n• Analyze trends and usage patterns\n\nYour data is never sold to third parties without your explicit consent.`
    },
    {
      id: 3,
      title: "Data Security",
      content: `We implement industry-standard security measures to protect your personal information. Your account is protected by secure passwords and two-factor authentication options.\n\nAll financial transactions are encrypted and processed through secure payment gateways. However, no method of transmission over the internet is 100% secure.`
    },
    {
      id: 4,
      title: "Your Rights",
      content: `You have the right to:\n• Access your personal data\n• Correct inaccurate information\n• Request deletion of your account and data\n• Opt-out of marketing communications\n• Download your data\n\nTo exercise these rights, contact us at support@kamaomoney.com`
    }
  ];

  // Terms & Conditions Sections
  const termsSections = [
    {
      id: 1,
      title: "User Eligibility",
      content: `You must be at least 18 years old to use Kamao Money. By using our platform, you represent and warrant that you are at least 18 years of age.\n\nKamao Money is available in India and select countries. Users from restricted countries are not permitted to use our services.`
    },
    {
      id: 2,
      title: "Account Registration",
      content: `To use Kamao Money, you must create an account with accurate, truthful, and complete information. You are responsible for:\n• Maintaining the confidentiality of your password\n• Protecting your account from unauthorized access\n• Notifying us immediately of any unauthorized use\n• All activities that occur under your account\n\nYou may not use another person's account or share your credentials.`
    },
    {
      id: 3,
      title: "User Conduct",
      content: `You agree not to:\n• Engage in fraudulent or illegal activities\n• Use automated tools, bots, or scripts to complete tasks\n• Attempt to manipulate earnings or claim rewards dishonestly\n• Harass, abuse, or threaten other users or staff\n• Share or sell your account credentials\n• Complete tasks on behalf of someone else\n• Use multiple accounts to increase earnings unfairly\n\nViolation of these rules will result in account suspension or permanent ban without refund.`
    },
    {
      id: 4,
      title: "Earnings and Withdrawals",
      content: `• Minimum withdrawal amount: ₹10\n• Withdrawal processing time: 24-48 hours\n• Available withdrawal methods: UPI, Amazon Gift Cards, Google Play\n\nWe reserve the right to:\n• Verify user identity and earnings before processing withdrawals\n• Freeze accounts under investigation for suspicious activity\n• Cancel withdrawals if fraudulent activity is detected\n• Retain earnings if terms are violated`
    }
  ];

  // Disclaimer Content
  const disclaimerContent = [
    {
      title: "⚠️ No Guarantee of Income",
      text: "Kamao Money does not guarantee any specific earnings or income. Actual earnings depend on the number of tasks completed, task availability, and reward amounts set by Kamao Money. Task availability varies and is subject to change without notice."
    },
    {
      title: "Earnings Disclaimer",
      text: "• Earnings are not guaranteed and may vary based on factors beyond our control\n• Tasks may not always be available due to advertiser demand\n• Reward amounts can change at any time\n• Your earning potential depends on time, effort, and task completion\n• Kamao Money is a supplementary income source, not a primary employment opportunity"
    },
    {
      title: "No Financial Advice",
      text: "Kamao Money is not a financial advisor and does not provide financial advice. We do not recommend treating Kamao Money earnings as your primary source of income. Always maintain stable employment or income sources."
    },
    {
      title: "Account Suspension & Termination",
      text: "Kamao Money reserves the right to suspend or terminate any account suspected of fraudulent activity, violation of terms, using automated tools, multiple account abuse, or any activity deemed harmful to the platform. In such cases, all pending earnings may be forfeited without prior notice."
    },
    {
      title: "Tax Responsibility",
      text: "You are responsible for all taxes, fees, and legal obligations related to earnings from Kamao Money. We recommend consulting with a tax professional regarding your earnings."
    }
  ];

  // Modal Component
  const PolicyModal = ({ title, sections, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {sections.map(section => (
            <div
              key={section.id}
              className={`policy-section ${expandedSection[`${title}-${section.id}`] ? 'active' : ''}`}
            >
              <div
                className="policy-title"
                onClick={() => toggleSection(`${title}-${section.id}`)}
              >
                <h3>{section.title}</h3>
                <span className="toggle-arrow">▼</span>
              </div>
              <div className="policy-text">
                {section.content.split('\n').map((line, idx) => (
                  <div key={idx} className="policy-line">{line || <br />}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <p>© 2025 Kamao Money. All rights reserved. | Last Updated: January 2025</p>
        </div>
      </div>
    </div>
  );

  // Disclaimer Modal Component
  const DisclaimerModal = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Disclaimer</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {disclaimerContent.map((section, idx) => (
            <div key={idx} className="disclaimer-section">
              <h3>{section.title}</h3>
              <p>
                {section.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <p>© 2025 Kamao Money. All rights reserved. | Last Updated: January 2025</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-content {
          width: 100%;
          max-width: 700px;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border);
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          background: var(--bg-card);
          z-index: 10;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }

        .modal-close:hover {
          color: var(--text-main);
        }

        .modal-body {
          padding: 24px;
        }

        .policy-section {
          margin-bottom: 12px;
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          background: rgba(127, 91, 255, 0.05);
        }

        .policy-section.active {
          border-color: rgba(127, 91, 255, 0.4);
        }

        .policy-title {
          padding: 14px 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
          background: rgba(127, 91, 255, 0.08);
        }

        .policy-title h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
        }

        .toggle-arrow {
          font-size: 14px;
          color: var(--violet);
          transition: transform 0.3s ease;
          font-weight: bold;
        }

        .policy-section.active .toggle-arrow {
          transform: rotate(180deg);
        }

        .policy-text {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .policy-section.active .policy-text {
          max-height: 600px;
          padding: 14px 16px;
        }

        .policy-line {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 4px;
        }

        .disclaimer-section {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .disclaimer-section:last-child {
          border-bottom: none;
        }

        .disclaimer-section h3 {
          font-size: 14px;
          font-weight: 700;
          color: var(--violet);
          margin-bottom: 8px;
        }

        .disclaimer-section p {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          background: rgba(127, 91, 255, 0.05);
          text-align: center;
          position: sticky;
          bottom: 0;
        }

        .modal-footer p {
          margin: 0;
          font-size: 11px;
          color: var(--text-muted);
        }

        .footer-link {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
          font-family: inherit;
          text-align: left;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--violet);
        }

        @media (max-width: 480px) {
          .modal-content {
            max-width: 95vw;
            max-height: 85vh;
          }

          .modal-header h2 {
            font-size: 20px;
          }

          .policy-title h3 {
            font-size: 13px;
          }

          .policy-line {
            font-size: 11px;
          }
        }
      `}</style>

      <footer className="ms-footer">
        <div className="ms-footer-container">
          {/* BRAND */}
          <div className="ms-footer-brand">
            <h3>Kamao Money</h3>
            <p>
              Kamao Money is a reward-based earning platform where users earn coins
              by completing simple tasks like watching ads, spinning wheels, solving captchas, 
              and referring friends.
            </p>
          </div>

          {/* LEGAL */}
          <div className="ms-footer-col">
            <h4>Legal</h4>
            <button 
              className="footer-link"
              onClick={() => setActiveModal('privacy')}
            >
              Privacy Policy
            </button>
            <button 
              className="footer-link"
              onClick={() => setActiveModal('terms')}
            >
              Terms & Conditions
            </button>
            <button 
              className="footer-link"
              onClick={() => setActiveModal('disclaimer')}
            >
              Disclaimer
            </button>
          </div>

          {/* COMMUNITY */}
          <div className="ms-footer-col">
            <h4>Community</h4>
            <a
              href="https://t.me/kamaomoney_official"
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
          © {new Date().getFullYear()} Kamao Money. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      {activeModal === 'privacy' && (
        <PolicyModal 
          title="Privacy Policy" 
          sections={privacySections} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'terms' && (
        <PolicyModal 
          title="Terms & Conditions" 
          sections={termsSections} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'disclaimer' && (
        <DisclaimerModal 
          onClose={() => setActiveModal(null)} 
        />
      )}
    </>
  );
}