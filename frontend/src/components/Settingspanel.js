import React from "react";

export default function SettingsPanel({
  theme, fontSize, temperature, activeModel, activePersona,
  models, personas,
  onThemeChange, onFontSizeChange, onTemperatureChange,
  onModelChange, onPersonaChange, onClose
}) {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>

        <div className="settings-header">
          <div className="settings-title">⚙ Settings</div>
          <button className="settings-close" onClick={onClose}>×</button>
        </div>

        <div className="settings-body">

          {/* Appearance */}
          <div className="settings-group">
            <div className="settings-group-label">Appearance</div>

            <div className="settings-row">
              <div>
                <div className="settings-row__label">Theme</div>
                <div className="settings-row__sub">Adjust the color scheme</div>
              </div>
              <div className="seg-control">
                <button className={`seg-btn${theme === "dark" ? " seg-btn--active" : ""}`} onClick={() => onThemeChange("dark")}>◑ Dark</button>
                <button className={`seg-btn${theme === "light" ? " seg-btn--active" : ""}`} onClick={() => onThemeChange("light")}>☀ Light</button>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <div className="settings-row__label">Font size</div>
                <div className="settings-row__sub">Chat message text size</div>
              </div>
              <div className="seg-control">
                {["sm","md","lg"].map(s => (
                  <button key={s} className={`seg-btn${fontSize === s ? " seg-btn--active" : ""}`} onClick={() => onFontSizeChange(s)}>
                    {s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Model */}
          <div className="settings-group">
            <div className="settings-group-label">Language Model</div>
            <div className="model-grid">
              {models.map(m => (
                <button
                  key={m.id}
                  className={`model-card${activeModel === m.id ? " model-card--active" : ""}`}
                  onClick={() => onModelChange(m.id)}
                >
                  <div className="model-card__name">
                    {m.label}
                    <span className="model-badge-pill">{m.badge}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Persona */}
          <div className="settings-group">
            <div className="settings-group-label">AI Persona</div>
            <div className="model-grid">
              {personas.map(p => (
                <button
                  key={p.id}
                  className={`model-card${activePersona === p.id ? " model-card--active" : ""}`}
                  onClick={() => onPersonaChange(p.id)}
                >
                  <div className="model-card__name">{p.icon} {p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="settings-group">
            <div className="settings-group-label">Generation</div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Temperature</div>
                <div className="settings-row__sub">Higher = more creative</div>
              </div>
            </div>
            <div className="slider-row">
              <span style={{fontSize:12,color:"var(--text3)"}}>Precise</span>
              <input
                type="range"
                className="settings-slider"
                min="0" max="1" step="0.1"
                value={temperature}
                onChange={e => onTemperatureChange(parseFloat(e.target.value))}
              />
              <span style={{fontSize:12,color:"var(--text3)"}}>Creative</span>
              <span className="slider-val">{temperature.toFixed(1)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}