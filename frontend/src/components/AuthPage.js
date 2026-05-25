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

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconCloud = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19A4.5 4.5 0 0 0 18 10h-.5a7.5 7.5 0 0 0-14 1.5 5 5 0 0 0 1.5 9.5z"/>
  </svg>
);

/* ─── Password Strength ─────────────────────── */
function getStrength(pw) {
  if (!pw) return { level: 0, label: "", cls: "" };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak",   cls: "weak"   };
  if (score === 2) return { level: 2, label: "Fair",   cls: "fair"   };
  return              { level: 3, label: "Strong", cls: "strong" };
}

/* ─── Help items shared by both pages ──────── */
const LOGIN_HELP = [
  { icon: <IconShield />, title: "Enterprise Grade", text: "Your data is encrypted end-to-end and stored securely." },
  { icon: <IconZap />, title: "Instant AI Access", text: "Login to instantly chat with your knowledge base." },
  { icon: <IconCloud />, title: "Cloud Synced", text: "Pick up exactly where you left off from any device." },
];

const REGISTER_HELP = [
  { icon: <IconMail />,  title: "Unique ID", text: "Your email acts as your secure, unique login identifier." },
  { icon: <IconShield />, title: "Secure Vault", text: "Every user gets their own isolated, private database." },
  { icon: <IconFileText />, title: "PDF Chat", text: "Upload your PDFs and extract insights in seconds." },
];

/* ═══════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════ */
export function LoginPage({ onLoginSuccess, onGoRegister }) {
  const [theme,    setTheme]    = useState("dark");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim())  { setError("Please enter your email address."); return; }
    if (!password)      { setError("Please enter your password."); return; }

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

    setError(
      data.error === "Email already exists"
        ? "An account with this email already exists. Try signing in instead."
        : data.error
    );

  } else {

    setSuccess("🎉 Account created successfully! Redirecting to sign in…");

    setTimeout(() => onRegisterSuccess(), 1600);

  }

} catch {

  setError("Cannot reach the server. Please make sure the backend is running.");

} finally {

  setLoading(false);

}
  };

  const isLight = theme === "light";

  return (
    <div className={`auth-root${isLight ? " auth--light" : ""}`}>
      {/* Background */}
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />
      <div className="auth-bg-grid" />

      {/* Theme Toggle */}
      <button
        id="auth-theme-toggle"
        className="auth-theme-toggle"
        onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        aria-label="Toggle theme"
      >
        {isLight ? "🌙" : "☀️"}
      </button>

      <div className="auth-split-layout">
        <div className="auth-split-left">
          {/* ── Card ── */}
          <div className="auth-card">

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo__mark">As</div>
            <div className="auth-logo__text">
              <span className="auth-logo__name">Askly</span>
              <span className="auth-logo__sub">Answers Powered by Your Data</span>
            </div>
          </div>

          <h1 className="auth-heading">Welcome back 👋</h1>
          <p className="auth-sub">
            Sign in to your workspace to continue chatting with your documents.
          </p>

          {/* Info banner */}
          <div className="auth-info">
            <span className="auth-info__icon">💡</span>
            <span>
              Enter the <strong>email</strong> and <strong>password</strong> you
              used when creating your account.
            </span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Error */}
            {error && (
              <div className="auth-error" role="alert">
                <span className="auth-error__icon">⚠</span>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">
                Email address
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IconMail /></span>
                <input
                  id="login-email"
                  type="email"
                  className="auth-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  required
                />
                {email.includes("@") && (
                  <span className="auth-input-valid">✓</span>
                )}
              </div>
              <span className="auth-hint">The email you registered with.</span>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IconLock /></span>
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  className="auth-input auth-input--password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <IconEye open={showPw} />
                </button>
              </div>
              <span className="auth-hint">
                Click the eye icon to show / hide your password.
              </span>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? <><span className="auth-spinner" /> Signing in…</>
                : "Sign in →"}
            </button>

            {/* Feature pills */}
            <div className="auth-features">
              <span className="auth-feature-pill">
                <span className="auth-feature-pill__icon">🔒</span> Secure JWT
              </span>
              <span className="auth-feature-pill">
                <span className="auth-feature-pill__icon">⚡</span> Instant access
              </span>
              <span className="auth-feature-pill">
                <span className="auth-feature-pill__icon">📄</span> PDF Chat
              </span>
            </div>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider__line" />
            <span className="auth-divider__text">New to Askly?</span>
            <div className="auth-divider__line" />
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <span>Don't have an account? </span>
            <button id="go-register" className="auth-link" onClick={onGoRegister}>
              Create a free account
            </button>
          </div>
        </div>
        </div> {/* closes auth-split-left */}

        {/* ── Help Guide Card ── */}
        <div className="auth-split-right">
          <div className="auth-help-card">
            <p className="auth-help-card__title">
              <IconZap /> Quick guide
            </p>
            <ul className="auth-help-list">
              {LOGIN_HELP.map((item, i) => (
                <li key={i} className="auth-help-item">
                  <span className="auth-help-icon">{item.icon}</span>
                  <div className="auth-help-text-wrap">
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REGISTER PAGE
═══════════════════════════════════════════ */
export function RegisterPage({ onRegisterSuccess, onGoLogin }) {
  const [theme,    setTheme]    = useState("dark");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  /* current "step" for the progress indicator */
  //const step = !name.trim() ? 1 : !email.includes("@") ? 2 : !password ? 3 : 4;

  const strength = getStrength(password);

  const passwordsMatch = confirm && password === confirm;
  const passwordsMismatch = confirm && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!name.trim())            { setError("Please enter your full name."); return; }
    if (!email.includes("@"))    { setError("Please enter a valid email address."); return; }
    if (password.length < 6)     { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)    { setError("Passwords do not match. Please re-check."); return; }

    try {
      setLoading(true);
      // const res  = await fetch(`${API}/register`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      // });

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

      const data = await res.json();

      if (data.error) {
        setError(
          data.error === "Email already exists"
            ? "An account with this email already exists. Try signing in instead."
            : data.error
        );
      } else {
        setSuccess("🎉 Account created successfully! Redirecting to sign in…");
        setTimeout(() => onRegisterSuccess(), 1600);
      }
    } catch {
      setError("Cannot reach the server. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  /* strength bar class helper */
  const barClass = (idx) => {
    const base = "auth-strength__bar";
    if (strength.level === 0) return base;
    if (strength.level >= 1 && idx === 0) return `${base} ${base}--${strength.cls}`;
    if (strength.level >= 2 && idx === 1) return `${base} ${base}--${strength.cls}`;
    if (strength.level >= 3 && idx === 2) return `${base} ${base}--${strength.cls}`;
    return base;
  };

  const isLight = theme === "light";

  /* steps config */
  const steps = [
    { label: "Name",     done: !!name.trim() },
    { label: "Email",    done: email.includes("@") },
    { label: "Password", done: password.length >= 6 },
    { label: "Done",     done: passwordsMatch },
  ];

  return (
    <div className={`auth-root${isLight ? " auth--light" : ""}`}>
      {/* Background */}
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />
      <div className="auth-bg-grid" />

      {/* Theme Toggle */}
      <button
        id="auth-theme-toggle"
        className="auth-theme-toggle"
        onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        aria-label="Toggle theme"
      >
        {isLight ? "🌙" : "☀️"}
      </button>

      <div className="auth-split-layout">
        <div className="auth-split-left">
          {/* ── Step indicator ── */}
          <div className="auth-steps" role="progressbar" aria-label="Registration progress">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="auth-step-line" />}
              <div className={`auth-step${s.done ? " auth-step--done" : ""}`}>
                <div className="auth-step__dot">
                  {s.done ? "✓" : i + 1}
                </div>
                <span className="auth-step__label">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── Card ── */}
        <div className="auth-card">

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo__mark">As</div>
            <div className="auth-logo__text">
              <span className="auth-logo__name">Askly</span>
              <span className="auth-logo__sub">Answers Powered by Your Data</span>
            </div>
          </div>

          <h1 className="auth-heading">Create your account ✨</h1>
          <p className="auth-sub">
            Fill in the fields below to get started. It only takes a minute.
          </p>

          {/* Info banner */}
          <div className="auth-info">
            <span className="auth-info__icon">📋</span>
            <span>
              All fields are <strong>required</strong>. Your email will be used
              as your login ID. Choose a strong password for security.
            </span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Error / Success */}
            {error && (
              <div className="auth-error" role="alert">
                <span className="auth-error__icon">⚠</span>
                {error}
              </div>
            )}
            {success && (
              <div className="auth-success" role="status">
                <span>✓</span> {success}
              </div>
            )}

            {/* ── Full Name ── */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-name">Full name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IconUser /></span>
                <input
                  id="reg-name"
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Jane Smith"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(""); }}
                  autoComplete="name"
                  required
                />
                {name.trim().length >= 2 && (
                  <span className="auth-input-valid">✓</span>
                )}
              </div>
              <span className="auth-hint">Enter your first and last name.</span>
            </div>

            {/* ── Email ── */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-email">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IconMail /></span>
                <input
                  id="reg-email"
                  type="email"
                  className="auth-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  required
                />
                {email.includes("@") && email.includes(".") && (
                  <span className="auth-input-valid">✓</span>
                )}
              </div>
              <span className="auth-hint">This will be your login username — use a real one.</span>
            </div>

            {/* ── Password ── */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IconLock /></span>
                <input
                  id="reg-password"
                  type={showPw ? "text" : "password"}
                  className="auth-input auth-input--password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <IconEye open={showPw} />
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <>
                  <div className="auth-strength">
                    <div className={barClass(0)} />
                    <div className={barClass(1)} />
                    <div className={barClass(2)} />
                  </div>
                  <div className="auth-strength__row">
                    <span className={`auth-strength__label auth-strength__label--${strength.cls}`}>
                      {strength.label} password
                    </span>
                    <span className="auth-strength__tips">
                      {strength.level < 3 ? "Add uppercase, numbers & symbols" : "Great password! 🎉"}
                    </span>
                  </div>
                </>
              )}
              {!password && (
                <span className="auth-hint">At least 6 characters. Mix letters, numbers & symbols.</span>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-confirm">Confirm password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IconLock /></span>
                <input
                  id="reg-confirm"
                  type={showCf ? "text" : "password"}
                  className="auth-input auth-input--password"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(""); }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowCf(v => !v)}
                  tabIndex={-1}
                  aria-label={showCf ? "Hide password" : "Show password"}
                >
                  <IconEye open={showCf} />
                </button>
              </div>

              {/* Match indicator */}
              {passwordsMatch && (
                <span className="auth-match auth-match--ok">✓ Passwords match</span>
              )}
              {passwordsMismatch && (
                <span className="auth-match auth-match--err">✕ Passwords do not match</span>
              )}
              {!confirm && (
                <span className="auth-hint">Type your password again to confirm.</span>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              className="auth-submit"
              disabled={loading || !!success}
            >
              {loading
                ? <><span className="auth-spinner" /> Creating account…</>
                : "Create account →"}
            </button>

            <p className="auth-terms">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider__line" />
            <span className="auth-divider__text">Already have an account?</span>
            <div className="auth-divider__line" />
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <button id="go-login" className="auth-link" onClick={onGoLogin}>
              Sign in instead
            </button>
          </div>
        </div>
        </div> {/* closes auth-split-left */}

        {/* ── Help Guide Card ── */}
        <div className="auth-split-right">
          <div className="auth-help-card">
            <p className="auth-help-card__title">
              <IconZap /> Getting started
            </p>
            <ul className="auth-help-list">
              {REGISTER_HELP.map((item, i) => (
                <li key={i} className="auth-help-item">
                  <span className="auth-help-icon">{item.icon}</span>
                  <div className="auth-help-text-wrap">
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
