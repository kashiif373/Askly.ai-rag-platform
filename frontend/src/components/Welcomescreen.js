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

export default function WelcomeScreen() {
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

    </div>
  );
}