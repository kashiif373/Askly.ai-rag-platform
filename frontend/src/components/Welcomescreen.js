import React from "react";

const PERSONA_DESCS = {
  assistant: "General-purpose help",
  analyst:   "Data & insights",
  coder:     "Code & engineering",
  writer:    "Writing & editing",
};

const SUGGESTIONS_BY_PERSONA = {
  assistant: [
    { label: "Summarize a document",  text: "Please summarize the uploaded PDF document for me." },
    { label: "Research a topic",       text: "Research the latest trends in artificial intelligence for enterprise use." },
    { label: "Draft an email",         text: "Help me draft a professional email to schedule a quarterly business review." },
    { label: "Create a plan",          text: "Create a 30-60-90 day onboarding plan for a new product manager." },
  ],
  analyst: [
    { label: "Data analysis",          text: "Analyze the key metrics from the uploaded report and highlight anomalies." },
    { label: "Market comparison",      text: "Compare the market performance of our top three competitors." },
    { label: "KPI dashboard design",   text: "Suggest the most important KPIs for a SaaS growth dashboard." },
    { label: "Trend forecast",         text: "What trends should I watch in cloud infrastructure for the next 2 years?" },
  ],
  coder: [
    { label: "Code review",            text: "Review my React component and suggest performance improvements." },
    { label: "Architecture design",    text: "Design a scalable microservices architecture for an e-commerce platform." },
    { label: "Debug this error",       text: "Help me debug a 'Cannot read property of undefined' error in JavaScript." },
    { label: "Best practices",         text: "What are the current best practices for securing a Node.js REST API?" },
  ],
  writer: [
    { label: "Write a blog post",      text: "Write a 500-word blog post on the future of remote work." },
    { label: "Edit my draft",          text: "Please review and improve the clarity of this paragraph:" },
    { label: "Executive summary",      text: "Write an executive summary for a product launch strategy document." },
    { label: "Proposal template",      text: "Create a professional project proposal template for a consulting firm." },
  ],
};

export default function WelcomeScreen({ personas, activePersona, onPersonaChange, onPromptSelect }) {
  const suggestions = SUGGESTIONS_BY_PERSONA[activePersona] ?? SUGGESTIONS_BY_PERSONA.assistant;

  return (
    <div className="welcome">

      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        <div className="welcome__logo">✦</div>
        <h1 className="welcome__heading">Hello, how can I<br /><strong>help you today?</strong></h1>
        <p className="welcome__sub">
          Upload PDFs to your knowledge base, then ask anything.<br />
          Switch personas and models for different results.
        </p>
      </div>

      {/* Persona selector */}
      <div style={{width:"100%"}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--text3)",marginBottom:10,paddingLeft:2}}>
          Choose AI Persona
        </div>
        <div className="persona-grid">
          {personas.map(p => (
            <button
              key={p.id}
              className={`persona-card${activePersona === p.id ? " persona-card--active" : ""}`}
              onClick={() => onPersonaChange(p.id)}
            >
              <div className="persona-icon">{p.icon}</div>
              <div className="persona-name">{p.label}</div>
              <div className="persona-desc">{PERSONA_DESCS[p.id]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt suggestions */}
      <div style={{width:"100%"}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--text3)",marginBottom:10,paddingLeft:2}}>
          Try asking…
        </div>
        <div className="prompt-grid">
          {suggestions.map((s, i) => (
            <button key={i} className="prompt-card" onClick={() => onPromptSelect(s.text)}>
              <div className="prompt-card__label">{s.label}</div>
              <div className="prompt-card__text">{s.text}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}