
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigate("/dashboard");
    } catch (err) {
      const messages = {
        "auth/invalid-credential":
          "Your email or password is incorrect.",
        "auth/user-not-found":
          "Your email or password is incorrect.",
        "auth/wrong-password":
          "Your email or password is incorrect.",
        "auth/invalid-email":
          "Please enter a valid email address.",
        "auth/too-many-requests":
          "Too many attempts. Please wait and try again.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
        "auth/operation-not-allowed":
          "Email and password login is not enabled in Firebase.",
      };

      setError(
        messages[err.code] || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setNotice("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      const messages = {
        "auth/popup-closed-by-user":
          "The Google sign-in window was closed.",
        "auth/popup-blocked":
          "Your browser blocked the popup. Allow popups and try again.",
        "auth/unauthorized-domain":
          "This website domain is not authorized in Firebase.",
      };

      setError(
        messages[err.code] ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setNotice(
        "If an account exists for that email, a reset email has been sent."
      );
    } catch (err) {
      setError(
        err.code === "auth/invalid-email"
          ? "Please enter a valid email address."
          : "We could not send the reset email. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-form-panel">
          <Link to="/" className="login-brand">
            <span>LF</span> FindIt
          </Link>

          <div className="login-heading">
            <p className="login-eyebrow">WELCOME BACK</p>
            <h1>Good to see you.</h1>
            <p>
              Log in to report, discover, and reunite lost items.
            </p>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <p className="login-success" role="status">
              {notice}
            </p>
          )}

          <button
            type="button"
            className="login-google"
            onClick={handleGoogleLogin}
            disabled={loading || resetLoading}
          >
            <span className="login-google-g">G</span>
            Continue with Google
          </button>

          <div className="login-divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <div className="login-password-row">
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="login-forgot"
                onClick={handleResetPassword}
                disabled={loading || resetLoading}
              >
                {resetLoading ? "Sending..." : "Forgot password?"}
              </button>
            </div>

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            <label className="login-show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) =>
                  setShowPassword(event.target.checked)
                }
              />
              Show password
            </label>

            <button
              type="submit"
              className="login-submit"
              disabled={loading || resetLoading}
            >
              {loading ? "Logging in..." : "Log in"}
              {!loading && <span aria-hidden="true"> →</span>}
            </button>
          </form>

          <p className="login-signup-link">
            New to FindIt? <Link to="/signup">Create an account</Link>
          </p>

          <p className="login-terms">
            Your community starts with a little help.
          </p>
        </div>

        <aside className="login-visual">
          <div className="login-visual-top">
            <span className="login-visual-pill">
              LOST & FOUND, SIMPLIFIED
            </span>
            <span className="login-visual-spark">✳</span>
          </div>

          <div className="login-visual-content">
            <p className="login-visual-kicker">
              EVERY ITEM HAS A STORY
            </p>
            <h2>
              Find what
              <br />
              matters.
            </h2>
            <p>
              Sign in to keep track of your reports and help
              someone reconnect with a missing belonging.
            </p>
          </div>

          <div className="login-visual-bottom">
            <div className="login-mini-avatar">F</div>
            <div>
              <strong>One community</strong>
              <p>Making lost-and-found easier for everyone.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}