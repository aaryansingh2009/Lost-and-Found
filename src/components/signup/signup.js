import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import "./signup.css";

const ERRORS = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Please choose a stronger password.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/popup-closed-by-user": "The Google window was closed.",
  "auth/popup-blocked": "Popup blocked. Allow popups and try again.",
  "auth/account-exists-with-different-credential":
    "This email is already linked to another sign-in method.",
};

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function run(action) {
    setError("");
    setLoading(true);
    try {
      await action();
      navigate("/dashboard");
    } catch (err) {
      setError(ERRORS[err.code] || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your full name.");
    if (form.password.length < 8)
      return setError("Your password must be at least 8 characters.");

    run(async () => {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );
      await updateProfile(user, { displayName: form.name.trim() });
    });
  };

  const handleGoogle = () => run(() => signInWithPopup(auth, googleProvider));

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-logo">LF</div>
        <h1>Create your account</h1>
        <p className="signup-sub">Help reunite lost items with their owners.</p>

        {error && <p className="signup-message signup-error" role="alert">{error}</p>}

        <button
          type="button"
          className="signup-google"
          onClick={handleGoogle}
          disabled={loading}
        >
          <span className="signup-google-g">G</span> Continue with Google
        </button>

        <div className="signup-divider">or</div>

        <form onSubmit={handleSignup}>
          <div className="signup-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={update}
              autoComplete="name"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update}
              autoComplete="email"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={update}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="signup-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}