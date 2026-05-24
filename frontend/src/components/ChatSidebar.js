// import React from "react";

// function ChatSidebar({
//   chats,
//   activeChat,
//   setActiveChat,
//   createNewChat
// }) {

//   return (

//     <div className="sidebar">

//       <div className="logoSection">

//         <div className="logoCircle">
//           AI
//         </div>

//         <h2>Enterprise GPT</h2>

//       </div>

//       <button
//         className="newChatButton"
//         onClick={createNewChat}
//       >
//         + New Chat
//       </button>

//       <div className="chatHistory">

//         {
//           chats.map(chat => (

//             <div
//               key={chat.id}
//               className={
//                 activeChat === chat.id
//                   ? "chatItem activeChat"
//                   : "chatItem"
//               }
//               onClick={() => setActiveChat(chat.id)}
//             >

//               {chat.title}

//             </div>
//           ))
//         }

//       </div>

//     </div>
//   );
// }

// export default ChatSidebar;




import React, { useState } from "react";

export default function Sidebar({
  collapsed, chats, allChats, activeChatId, searchQuery, documents,
  file, isUploading, uploadProgress,
  onToggleCollapse, onSearchChange, onSelectChat, onNewChat,
  onDeleteChat, onStarChat, onRenameChat,
  onFileChange, onUpload, onDeleteDocument,
  onOpenSettings, onOpenCommand, theme, onToggleTheme
}) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const startRename = (chat) => {
    setRenamingId(chat.id);
    setRenameVal(chat.title);
  };

  const commitRename = (id) => {
    if (renameVal.trim()) onRenameChat(id, renameVal.trim());
    setRenamingId(null);
  };

  const starredChats = chats.filter(c => c.starred);
  const recentChats  = chats.filter(c => !c.starred);

  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>

      {/* Logo */}
      <div className="sidebar__logo">
        <div className="logo-mark">✦</div>
        <div>
          <div className="logo-text">Askly.ai</div>
          <div className="logo-sub">Answers  Powered by Your Data  </div>
        </div>
        <button className="sidebar__collapse-btn" onClick={onToggleCollapse} title="Collapse">◀</button>
      </div>

      {/* Search */}
      <div className="sidebar__search">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search chats…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* New Chat */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <span>＋</span> New Chat
      </button>

      {/* Chat list */}
      <div className="chat-list">
        {starredChats.length > 0 && (
          <>
            <div className="sidebar__section-label">★ Starred</div>
            {starredChats.map(chat => (
              <ChatItem key={chat.id} chat={chat} active={activeChatId === chat.id}
                renamingId={renamingId} renameVal={renameVal} setRenameVal={setRenameVal}
                onSelect={() => onSelectChat(chat.id)}
                onStar={() => onStarChat(chat.id)}
                onDelete={() => onDeleteChat(chat.id)}
                onRename={() => startRename(chat)}
                onRenameCommit={() => commitRename(chat.id)}
              />
            ))}
          </>
        )}

        {recentChats.length > 0 && (
          <>
            <div className="sidebar__section-label">Recent</div>
            {recentChats.map(chat => (
              <ChatItem key={chat.id} chat={chat} active={activeChatId === chat.id}
                renamingId={renamingId} renameVal={renameVal} setRenameVal={setRenameVal}
                onSelect={() => onSelectChat(chat.id)}
                onStar={() => onStarChat(chat.id)}
                onDelete={() => onDeleteChat(chat.id)}
                onRename={() => startRename(chat)}
                onRenameCommit={() => commitRename(chat.id)}
              />
            ))}
          </>
        )}

        {chats.length === 0 && (
          <div style={{padding:"24px 12px",textAlign:"center",fontSize:13,color:"var(--text3)"}}>
            No chats found
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="docs-section">
        <div className="docs-section__header">
          <span className="docs-section__title">Knowledge Base</span>
          <span className="docs-section__count">{documents.length}</span>
        </div>

        {documents.length === 0 ? (
          <div style={{padding:"8px 8px",fontSize:12,color:"var(--text3)"}}>No documents uploaded</div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="doc-item">
              <span className="doc-icon">📄</span>
              <span className="doc-name" title={doc.name}>{doc.name}</span>
              <button className="doc-delete" onClick={() => onDeleteDocument(doc.name)} title="Delete">×</button>
            </div>
          ))
        )}
      </div>

      {/* Upload */}
      <div className="upload-strip">
        <div className="upload-zone">
          <label className="upload-label" style={{cursor:"pointer"}}>
            {file ? `📎 ${file.name.length > 22 ? file.name.slice(0,22)+"…" : file.name}` : "＋  Attach PDF…"}
            <input
              type="file"
              className="upload-file-input"
              accept=".pdf"
              onChange={e => onFileChange(e.target.files[0])}
            />
          </label>
          {file && (
            <button className="upload-btn" onClick={onUpload} disabled={isUploading}>
              {isUploading ? `${uploadProgress}%` : "Upload"}
            </button>
          )}
        </div>
        {isUploading && (
          <div className="upload-progress">
            <div className="upload-progress__bar" style={{width: `${uploadProgress}%`}} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar__footer">
        <button className="sidebar__footer-btn" onClick={onOpenCommand} title="Command palette">
          ⌘ Command
        </button>
        <button className="sidebar__footer-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀ Light" : "◑ Dark"}
        </button>
        <button className="sidebar__footer-btn" onClick={onOpenSettings} title="Settings">
          ⚙ Settings
        </button>
      </div>

    </aside>
  );
}

function ChatItem({ chat, active, renamingId, renameVal, setRenameVal, onSelect, onStar, onDelete, onRename, onRenameCommit }) {
  return (
    <div
      className={`chat-item${active ? " chat-item--active" : ""}${chat.starred ? " chat-item--starred" : ""}`}
      onClick={onSelect}
    >
      <span className="chat-item__star" onClick={e => { e.stopPropagation(); onStar(); }}>★</span>

      {renamingId === chat.id ? (
        <input
          value={renameVal}
          onChange={e => setRenameVal(e.target.value)}
          onBlur={onRenameCommit}
          onKeyDown={e => { if (e.key === "Enter") onRenameCommit(); }}
          autoFocus
          onClick={e => e.stopPropagation()}
          style={{
            flex: 1, background: "var(--bg3)", border: "1px solid var(--accent)",
            borderRadius: 6, padding: "2px 6px", fontSize: 13, color: "var(--text)",
            outline: "none", fontFamily: "inherit"
          }}
        />
      ) : (
        <span className="chat-item__title">{chat.title}</span>
      )}

      <div className="chat-item__actions">
        <button className="chat-item__action" onClick={e => { e.stopPropagation(); onRename(); }} title="Rename">✎</button>
        <button className="chat-item__action chat-item__action--danger" onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete">⊗</button>
      </div>
    </div>
  );
}