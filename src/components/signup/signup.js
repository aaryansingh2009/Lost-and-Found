
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(result.user, {
        displayName: name.trim(),
      });

      navigate("/dashboard");
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "An account with this email already exists.",
        "auth/invalid-email":
          "Please enter a valid email address.",
        "auth/weak-password":
          "Please choose a stronger password.",
        "auth/operation-not-allowed":
          "Email signup is not enabled in Firebase.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
      };

      setError(
        messages[err.code] ||
          "We could not create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");
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
        "auth/account-exists-with-different-credential":
          "An account may already exist with this email using another sign-in method.",
      };

      setError(
        messages[err.code] ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-form-panel">
          <Link to="/" className="signup-brand">
            <span>LF</span> FindIt
          </Link>

          <div className="signup-heading">
            <p className="signup-eyebrow">WELCOME TO FINDIT</p>
            <h1>Create your account</h1>
            <p>
              Join your community and help reunite lost items.
            </p>
          </div>

          {error && (
            <p className="signup-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            className="signup-google"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <span className="signup-google-g">G</span>
            Continue with Google
          </button>

          <div className="signup-divider">
            <span>OR SIGN UP WITH EMAIL</span>
          </div>

          <form className="signup-form" onSubmit={handleSignup}>
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />

            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <label htmlFor="signup-confirm-password">
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              required
            />

            <label className="signup-show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) =>
                  setShowPassword(event.target.checked)
                }
              />
              Show passwords
            </label>

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <span aria-hidden="true"> →</span>}
            </button>
          </form>

          <p className="signup-login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          <p className="signup-terms">
            By continuing, you agree to use FindIt responsibly.
          </p>
        </div>

        <aside className="signup-visual">
          <div className="signup-visual-top">
            <span className="signup-visual-pill">
              COMMUNITY POWERED
            </span>
            <span className="signup-visual-spark">✳</span>
          </div>

          <div className="signup-visual-content">
            <p className="signup-visual-kicker">LOST SOMETHING?</p>
            <h2>
              Small actions.
              <br />
              Big reunions.
            </h2>
            <p>
              A backpack, a water bottle, a favorite notebook.
              Help lost belongings find their way home.
            </p>
          </div>

          <div className="signup-visual-bottom">
            <div className="signup-mini-avatar">F</div>
            <div>
              <strong>Better together</strong>
              <p>A community that looks out for one another.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}