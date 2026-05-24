import React, { useState, useEffect, useRef } from "react";

const STATIC_COMMANDS = [
  { icon: "✦", label: "New chat",       sub: "Start a fresh conversation",      action: "newChat",       kbd: "⌘N" },
  { icon: "⚙", label: "Settings",       sub: "Model, theme, preferences",        action: "openSettings",  kbd: "⌘," },
  { icon: "⬇", label: "Export chat",    sub: "Download as .txt",                 action: "exportChat",    kbd: "" },
  { icon: "⊘", label: "Clear chat",     sub: "Remove all messages",              action: "clearChat",     kbd: "" },
  { icon: "◑", label: "Toggle theme",   sub: "Switch dark / light",              action: "toggleTheme",   kbd: "⌘⇧T" },
];

export default function CommandPalette({ chats, documents, onClose, onSelectChat, onNewChat, onOpenSettings, onExportChat, onClearChat, onToggleTheme }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.toLowerCase().trim();

  const filteredCommands = STATIC_COMMANDS.filter(c =>
    !q || c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q)
  );

  const filteredChats = q
    ? chats.filter(c => c.title.toLowerCase().includes(q)).slice(0, 5)
    : chats.slice(-5).reverse();

  const filteredDocs = q
    ? documents.filter(d => d.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const handleCommand = (action) => {
    switch(action) {
      case "newChat":       onNewChat(); break;
      case "openSettings":  onOpenSettings(); break;
      case "exportChat":    onExportChat(); break;
      case "clearChat":     onClearChat(); break;
      case "toggleTheme":   onToggleTheme(); break;
    }
  };

  return (
    <div className="command-overlay" onClick={onClose}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>

        <div className="command-input-wrap">
          <span className="command-prefix">⌘</span>
          <input
            ref={inputRef}
            className="command-input"
            placeholder="Type a command or search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="command-shortcut">ESC</span>
        </div>

        <div className="command-list">

          {filteredCommands.length > 0 && (
            <>
              <div className="command-section-label">Commands</div>
              {filteredCommands.map(cmd => (
                <div key={cmd.action} className="command-item" onClick={() => handleCommand(cmd.action)}>
                  <div className="command-item__icon">{cmd.icon}</div>
                  <div>
                    <div className="command-item__label">{cmd.label}</div>
                    <div className="command-item__sub">{cmd.sub}</div>
                  </div>
                  {cmd.kbd && <span className="command-item__kbd">{cmd.kbd}</span>}
                </div>
              ))}
            </>
          )}

          {filteredChats.length > 0 && (
            <>
              <div className="command-section-label">Recent Chats</div>
              {filteredChats.map(chat => (
                <div key={chat.id} className="command-item" onClick={() => onSelectChat(chat.id)}>
                  <div className="command-item__icon">💬</div>
                  <div>
                    <div className="command-item__label">{chat.title}</div>
                    <div className="command-item__sub">{chat.messages.length} messages</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {filteredDocs.length > 0 && (
            <>
              <div className="command-section-label">Documents</div>
              {filteredDocs.map(doc => (
                <div key={doc.id} className="command-item">
                  <div className="command-item__icon">📄</div>
                  <div>
                    <div className="command-item__label">{doc.name}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {filteredCommands.length === 0 && filteredChats.length === 0 && (
            <div className="command-empty">No results for "{query}"</div>
          )}

        </div>
      </div>
    </div>
  );
}