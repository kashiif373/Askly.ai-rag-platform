import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const formatTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", margin: "12px 0", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px", background: "var(--bg4)",
        borderBottom: "1px solid var(--border)", fontSize: 12
      }}>
        <span style={{ color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>{language || "code"}</span>
        <button
          onClick={copy}
          style={{
            background: "transparent", border: "1px solid var(--border)", borderRadius: 6,
            color: copied ? "var(--success)" : "var(--text3)", cursor: "pointer",
            fontFamily: "DM Sans, sans-serif", fontSize: 11, padding: "3px 8px"
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: 13, lineHeight: 1.6 }}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownMessage = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        if (!inline && match) {
          return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />;
        }
        return <code className={className} {...props}>{children}</code>;
      }
    }}
  >
    {text}
  </ReactMarkdown>
);

export default function ChatArea({ messages, loading, chatEndRef, onCopy, onRegenerate }) {
  return (
    <div className="message-list">
      {messages.map((msg, i) => (
        <div key={i} className={`msg-row msg-row--${msg.type}`}>

          {msg.type === "ai" && (
            <div className="msg-avatar msg-avatar--ai">✦</div>
          )}

          <div className="msg-content">
            <div className="msg-meta">
              <span>{msg.type === "user" ? "You" : "Enterprise AI"}</span>
              {msg.timestamp && <span>{formatTime(msg.timestamp)}</span>}
              {msg.model && <span className="msg-meta__model">{msg.model}</span>}
            </div>

            <div className={`msg-bubble msg-bubble--${msg.type}`}>
              {msg.type === "user"
                ? <p style={{ margin: 0, lineHeight: 1.75 }}>{msg.text}</p>
                : <MarkdownMessage text={msg.text} />
              }
            </div>

            <div className="msg-actions">
              <button className="msg-action-btn" onClick={() => onCopy(msg.text)}>copy</button>
              {msg.type === "ai" && i === messages.length - 1 && (
                <button className="msg-action-btn" onClick={onRegenerate}>regenerate</button>
              )}
            </div>
          </div>

          {msg.type === "user" && (
            <div className="msg-avatar msg-avatar--user">U</div>
          )}

        </div>
      ))}

      {loading && (
        <div className="typing-indicator">
          <div className="msg-avatar msg-avatar--ai">✦</div>
          <div className="typing-dots">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}