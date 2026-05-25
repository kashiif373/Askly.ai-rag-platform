import React, { useState } from "react";
import "./AuthPage.css";

const API = process.env.REACT_APP_API_URL;

/* ─── Inline SVG Icons ─────────────────────── */
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
);

const IconEye = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ───────────────────────────────────────────── */

export function LoginPage({ onLoginSuccess, onGoRegister }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(`${API}/login`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })

      });

      const data = await response.json();

      if (data.error) {

        setError(data.error);

      } else {

        localStorage.setItem(
          "token",
          data.access_token
        );

        onLoginSuccess(data.access_token);

      }

    } catch {

      setError(
        "Cannot reach the server."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="auth-root">
      <div className="auth-split-layout">
        <div className="auth-split-left">
          <div className="auth-card">

            <h1 className="auth-heading">
              Welcome Back 👋
            </h1>

        <p className="auth-sub">
          Login to continue
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="auth-field">

            <label className="auth-label">
              Email
            </label>

            <div className="auth-input-wrap">

              <span className="auth-input-icon">
                <IconMail />
              </span>

              <input
                type="email"
                className="auth-input"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>
          </div>

          <div className="auth-field">

            <label className="auth-label">
              Password
            </label>

            <div className="auth-input-wrap">

              <span className="auth-input-icon">
                <IconLock />
              </span>

              <input
                type={showPw ? "text" : "password"}
                className="auth-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="auth-eye-btn"
                onClick={() =>
                  setShowPw(!showPw)
                }
              >
                <IconEye open={showPw} />
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Sign In →"}

          </button>

          <div className="auth-footer">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              className="auth-link"
              onClick={onGoRegister}
            >
              Register
            </button>

          </div>

        </form>

          </div>
        </div>

        <div className="auth-split-right">
          <div className="auth-help-card">
            <h2 className="auth-help-card__title">Welcome Guide</h2>
            <ul className="auth-help-list">
              <li className="auth-help-item">
                <div className="auth-help-icon">🚀</div>
                <div className="auth-help-text-wrap">
                  <strong>Quick Access</strong>
                  <span>Sign in to pick up right where you left off.</span>
                </div>
              </li>
              <li className="auth-help-item">
                <div className="auth-help-icon">🔒</div>
                <div className="auth-help-text-wrap">
                  <strong>Secure Platform</strong>
                  <span>Your data is protected with enterprise-grade security.</span>
                </div>
              </li>
              <li className="auth-help-item">
                <div className="auth-help-icon">⚡</div>
                <div className="auth-help-text-wrap">
                  <strong>Super Fast</strong>
                  <span>Experience lightning fast speeds across all features.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */

export function RegisterPage({
  onRegisterSuccess,
  onGoLogin
}) {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");

  const [showPw, setShowPw] = useState(false);

  const [showCf, setShowCf] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimum 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(`${API}/register`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          password
        })

      });

      const data = await response.json();

      if (data.error) {

        setError(data.error);

      } else {

        setSuccess(
          "🎉 Account created successfully!"
        );

        setTimeout(() => {

          onRegisterSuccess();

        }, 1500);

      }

    } catch {

      setError(
        "Cannot reach the server."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="auth-root">
      <div className="auth-split-layout">
        <div className="auth-split-left">
          <div className="auth-card">

            <h1 className="auth-heading">
              Create Account ✨
            </h1>

        <p className="auth-sub">
          Register to continue
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <div className="auth-field">

            <label className="auth-label">
              Full Name
            </label>

            <div className="auth-input-wrap">

              <span className="auth-input-icon">
                <IconUser />
              </span>

              <input
                type="text"
                className="auth-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>
          </div>

          <div className="auth-field">

            <label className="auth-label">
              Email
            </label>

            <div className="auth-input-wrap">

              <span className="auth-input-icon">
                <IconMail />
              </span>

              <input
                type="email"
                className="auth-input"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>
          </div>

          <div className="auth-field">

            <label className="auth-label">
              Password
            </label>

            <div className="auth-input-wrap">

              <span className="auth-input-icon">
                <IconLock />
              </span>

              <input
                type={showPw ? "text" : "password"}
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="auth-eye-btn"
                onClick={() =>
                  setShowPw(!showPw)
                }
              >
                <IconEye open={showPw} />
              </button>

            </div>
          </div>

          <div className="auth-field">

            <label className="auth-label">
              Confirm Password
            </label>

            <div className="auth-input-wrap">

              <span className="auth-input-icon">
                <IconLock />
              </span>

              <input
                type={showCf ? "text" : "password"}
                className="auth-input"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) =>
                  setConfirm(e.target.value)
                }
              />

              <button
                type="button"
                className="auth-eye-btn"
                onClick={() =>
                  setShowCf(!showCf)
                }
              >
                <IconEye open={showCf} />
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create Account →"}

          </button>

          <div className="auth-footer">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              className="auth-link"
              onClick={onGoLogin}
            >
              Login
            </button>

          </div>

        </form>

          </div>
        </div>

        <div className="auth-split-right">
          <div className="auth-help-card">
            <h2 className="auth-help-card__title">Why Join Us?</h2>
            <ul className="auth-help-list">
              <li className="auth-help-item">
                <div className="auth-help-icon">✨</div>
                <div className="auth-help-text-wrap">
                  <strong>Getting Started</strong>
                  <span>Create an account in seconds and unlock all features.</span>
                </div>
              </li>
              <li className="auth-help-item">
                <div className="auth-help-icon">🤝</div>
                <div className="auth-help-text-wrap">
                  <strong>Community Driven</strong>
                  <span>Join thousands of other users on our platform.</span>
                </div>
              </li>
              <li className="auth-help-item">
                <div className="auth-help-icon">💡</div>
                <div className="auth-help-text-wrap">
                  <strong>Smart Tools</strong>
                  <span>Access exclusive tools designed to boost your productivity.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}