import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import "./login.css";

const ERRORS = {
  "auth/invalid-credential": "Your email or password is incorrect.",
  "auth/user-not-found": "Your email or password is incorrect.",
  "auth/wrong-password": "Your email or password is incorrect.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/popup-closed-by-user": "The Google window was closed.",
  "auth/popup-blocked": "Popup blocked. Allow popups and try again.",
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function run(action) {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(ERRORS[err.code] || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    run(async () => {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      navigate("/dashboard");
    });
  };

  const handleGoogle = () =>
    run(async () => {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    });

  const handleReset = () => {
    if (!form.email.trim()) return setError("Enter your email first.");
    run(async () => {
      await sendPasswordResetEmail(auth, form.email.trim());
      setNotice("Reset email sent. Check your inbox.");
    });
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">LF</div>
        <h1>Welcome back</h1>
        <p className="login-sub">Log in to your FindIt account.</p>

        {error && <p className="login-message login-error" role="alert">{error}</p>}
        {notice && <p className="login-message login-success" role="status">{notice}</p>}

        <button
          type="button"
          className="login-google"
          onClick={handleGoogle}
          disabled={loading}
        >
          <span className="login-google-g">G</span> Continue with Google
        </button>

        <div className="login-divider">or</div>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="login-forgot"
                onClick={handleReset}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={update}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="login-footer">
          New to FindIt? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}