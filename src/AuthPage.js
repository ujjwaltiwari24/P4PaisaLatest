import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./auth.css";

export default function AuthPage() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);
      // 🔥 NO redirect → NO sessionStorage issue
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">₹</div>
          <h1>Money Share</h1>
          <p>Simple • Secure • Rewarding</p>
        </div>

        <div className="auth-content">
          <h2>Sign in to your account</h2>
          <p className="auth-subtext">
            Secure Google login to access your earnings and rewards.
          </p>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            Continue with Google
          </button>

          <div className="auth-trust">
            🔒 We never post anything on your behalf
          </div>

          <p className="auth-legal">
            By continuing, you agree to our{" "}
            <span>Terms</span> & <span>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
