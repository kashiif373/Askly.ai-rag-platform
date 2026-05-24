// import React, {
//   useState,
//   useRef,
//   useEffect
// } from "react";

// import axios from "axios";

// import {
//   FaPaperPlane,
//   FaMoon,
//   FaSun
// } from "react-icons/fa";

// import { v4 as uuidv4 }
// from "uuid";

// import "./HomePage.css";

// import MessageBubble
// from "./MessageBubble";

// function HomePage() {

//   // Theme
//   const [theme, setTheme] =
//     useState("dark");

//   // File
//   const [file, setFile] =
//     useState(null);

//   // Documents
//   const [documents, setDocuments] =
//     useState([]);

//   // Question
//   const [question, setQuestion] =
//     useState("");

//   // Loading
//   const [loading, setLoading] =
//     useState(false);

//   // Chats
//   const [chats, setChats] = useState([
//     {
//       id: uuidv4(),
//       title: "New Chat",
//       messages: []
//     }
//   ]);

//   // Active Chat
//   const [activeChat, setActiveChat] =
//     useState(chats[0].id);

//   // Scroll
//   const chatEndRef = useRef(null);

//   // Current Chat
//   const currentChat =
//     chats.find(c => c.id === activeChat);

//   // Auto Scroll
//   useEffect(() => {

//     chatEndRef.current?.scrollIntoView({
//       behavior: "smooth"
//     });

//   }, [chats]);

//   // Load Documents
//   useEffect(() => {

//     fetchDocuments();

//   }, []);

//   // Fetch uploaded PDFs
//   const fetchDocuments = async () => {

//     try {

//       const response = await axios.get(
//         "http://127.0.0.1:8000/documents"
//       );

//       const docs =
//         response.data.documents.map(
//           (doc, index) => ({
//             id: index,
//             name: doc
//           })
//         );

//       setDocuments(docs);

//     } catch (error) {

//       console.error(error);
//     }
//   };

//   // Delete Document
//   const deleteDocument = async (
//     filename
//   ) => {

//     try {

//       await axios.delete(
//         `http://127.0.0.1:8000/delete-document/${filename}`
//       );

//       fetchDocuments();

//     } catch (error) {

//       console.error(error);
//     }
//   };

//   // Theme Toggle
//   const toggleTheme = () => {

//     setTheme(prev =>
//       prev === "dark"
//         ? "light"
//         : "dark"
//     );
//   };

//   // Upload PDF
//   const uploadFile = async () => {

//     if (!file) {
//       alert("Select PDF");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("file", file);

//     try {

//       setLoading(true);

//       await axios.post(
//         "http://127.0.0.1:8000/upload",
//         formData
//       );

//       fetchDocuments();

//       alert("PDF uploaded successfully");

//     } catch (error) {

//       console.error(error);

//       alert("Upload failed");

//     } finally {

//       setLoading(false);
//     }
//   };

//   // Create New Chat
//   const createNewChat = () => {

//     const newChat = {
//       id: uuidv4(),
//       title: "New Chat",
//       messages: []
//     };

//     setChats(prev => [...prev, newChat]);

//     setActiveChat(newChat.id);
//   };

//   // Update Chat Messages
//   const updateChatMessages =
//     (messages) => {

//       setChats(prev =>
//         prev.map(chat =>
//           chat.id === activeChat
//             ? { ...chat, messages }
//             : chat
//         )
//       );
//     };

//   // Ask AI
//   const askQuestion = async () => {

//     if (!question.trim()) return;

//     // Auto Chat Title
//     if (
//       currentChat.title === "New Chat"
//     ) {

//       const title =
//         question.length > 30
//           ? question.substring(0, 30) + "..."
//           : question;

//       setChats(prev =>
//         prev.map(chat =>
//           chat.id === activeChat
//             ? {
//                 ...chat,
//                 title
//               }
//             : chat
//         )
//       );
//     }

//     // User Message
//     const userMessage = {
//       type: "user",
//       text: question
//     };

//     // AI Placeholder
//     const aiMessage = {
//       type: "ai",
//       text: ""
//     };

//     const updatedMessages = [
//       ...currentChat.messages,
//       userMessage,
//       aiMessage
//     ];

//     updateChatMessages(updatedMessages);

//     const currentQuestion = question;

//     setQuestion("");

//     try {

//       setLoading(true);

//       const response = await fetch(
//         `http://127.0.0.1:8000/ask?question=${encodeURIComponent(currentQuestion)}`,
//         {
//           method: "POST"
//         }
//       );

//       const reader = response.body.getReader();

//       const decoder = new TextDecoder();

//       let done = false;

//       let streamedText = "";

//       while (!done) {

//         const { value, done: doneReading } =
//           await reader.read();

//         done = doneReading;

//         const chunk =
//           decoder.decode(value || new Uint8Array());

//         streamedText += chunk;

//         updateChatMessages([

//           ...updatedMessages.slice(0, -1),

//           {
//             type: "ai",
//             text: streamedText
//           }
//         ]);
//       }

//     } catch (error) {

//       console.error(error);

//     } finally {

//       setLoading(false);
//     }
//   };

//   // Enter Support
//   const handleKeyDown = (e) => {

//     if (
//       e.key === "Enter" &&
//       !e.shiftKey
//     ) {

//       e.preventDefault();

//       askQuestion();
//     }
//   };

//   return (

//     <div className={`app ${theme}`}>

//       {/* Sidebar */}
//       <div className="sidebar">

//         {/* Logo */}
//         <div className="logoSection">

//           <div className="logoCircle">
//             AI
//           </div>

//           <h2>Enterprise GPT</h2>

//         </div>

//         {/* New Chat */}
//         <button
//           className="newChatButton"
//           onClick={createNewChat}
//         >
//           + New Chat
//         </button>

//         {/* Chat History */}
//         <div className="chatHistory">

//           {
//             chats.map(chat => (

//               <div
//                 key={chat.id}
//                 className={
//                   activeChat === chat.id
//                     ? "chatItem activeChat"
//                     : "chatItem"
//                 }
//                 onClick={() =>
//                   setActiveChat(chat.id)
//                 }
//               >

//                 {chat.title}

//               </div>
//             ))
//           }

//         </div>

//         {/* Documents */}
//         <div className="documentsSection">

//           <h3>Documents</h3>

//           {
//             documents.length === 0 ? (

//               <p className="noDocs">
//                 No documents uploaded
//               </p>

//             ) : (

//               documents.map(doc => (

//                 <div
//                   key={doc.id}
//                   className="documentItem"
//                 >

//                   <span>
//                     📄 {doc.name}
//                   </span>

//                   <button
//                     className="deleteDocButton"
//                     onClick={() =>
//                       deleteDocument(doc.name)
//                     }
//                   >
//                     ×
//                   </button>

//                 </div>
//               ))
//             )
//           }

//         </div>

//       </div>

//       {/* Main */}
//       <div className="main">

//         {/* Header */}
//         <div className="header">

//           <div className="headerTitle">
//             Enterprise AI Assistant
//           </div>

//           <div className="headerActions">

//             <button
//               className="themeButton"
//               onClick={toggleTheme}
//             >

//               {
//                 theme === "dark"
//                   ? <FaSun />
//                   : <FaMoon />
//               }

//             </button>

//           </div>

//         </div>

//         {/* Chat */}
//         <div className="chatContainer">

//           {
//             currentChat.messages.length === 0 && (

//               <div className="welcomeScreen">

//                 <h1>
//                   Enterprise AI
//                 </h1>

//                 <p>
//                   Upload PDFs and chat intelligently.
//                 </p>

//               </div>
//             )
//           }

//           {
//             currentChat.messages.map(
//               (msg, index) => (

//                 <MessageBubble
//                   key={index}
//                   msg={msg}
//                 />
//               )
//             )
//           }

//           {
//             loading && (

//               <div className="typingContainer">

//                 <div className="typingBubble">

//                   <span></span>
//                   <span></span>
//                   <span></span>

//                 </div>

//               </div>
//             )
//           }

//           <div ref={chatEndRef}></div>

//         </div>

//         {/* Input */}
//         <div className="inputWrapper">

//           <div className="inputContainer">

//             {/* Attach */}
//             <label className="attachButton">

//               +

//               <input
//                 type="file"
//                 hidden
//                 accept=".pdf"
//                 onChange={(e) =>
//                   setFile(e.target.files[0])
//                 }
//               />

//             </label>

//             {/* Input */}
//             <textarea
//               className="textarea"
//               placeholder="Ask anything..."
//               value={question}
//               onChange={(e) =>
//                 setQuestion(e.target.value)
//               }
//               onKeyDown={handleKeyDown}
//             />

//             {/* Upload */}
//             <button
//               className="uploadButton"
//               onClick={uploadFile}
//             >
//               Upload
//             </button>

//             {/* Send */}
//             <button
//               className="sendButton"
//               onClick={askQuestion}
//             >
//               <FaPaperPlane />
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default HomePage;






import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./HomePage.css";
import Sidebar from "./ChatSidebar";
import ChatArea from "./Chatarea";
import CommandPalette from "./Commandpalette";
import SettingsPanel from "./Settingspanel";
import WelcomeScreen from "./Welcomescreen";

const API = "http://127.0.0.1:8000";

const MODELS = [
  { id: "gpt-4o", label: "GPT-4o", badge: "Fast" },
  { id: "gpt-4-turbo", label: "GPT-4 Turbo", badge: "Smart" },
  { id: "claude-3-opus", label: "Claude 3 Opus", badge: "Best" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", badge: "Long" },
];

const PERSONAS = [
  { id: "assistant", label: "Assistant", icon: "✦", prompt: "You are a helpful enterprise AI assistant." },
  { id: "analyst",  label: "Analyst",   icon: "◈", prompt: "You are a data analyst expert. Be concise, cite evidence." },
  { id: "coder",    label: "Engineer",  icon: "⌥", prompt: "You are a senior software engineer. Focus on clean, performant code." },
  { id: "writer",   label: "Writer",    icon: "◇", prompt: "You are a professional writer. Be eloquent and precise." },
];

export default function HomePage({ user, token, onLogout }) {
  const [theme, setTheme] = useState("dark");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState(MODELS[0].id);
  const [activePersona, setActivePersona] = useState(PERSONAS[0].id);
  const [commandOpen, setCommandOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState("md");
  const [temperature, setTemperature] = useState(0.7);
  const [messageTokens, setMessageTokens] = useState(0);
  const [pinnedChats, setPinnedChats] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [chats, setChats] = useState([
    { id: uuidv4(), title: "New Chat", messages: [], createdAt: Date.now(), starred: false }
  ]);
  const [activeChat, setActiveChatId] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeChatId = activeChat ?? chats[0]?.id;
  const currentChat = chats.find(c => c.id === activeChatId) ?? chats[0];

  // Token estimation
  useEffect(() => {
    setMessageTokens(Math.round(question.length / 4));
  }, [question]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(v => !v);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { fetchDocuments(); }, []);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data.documents.map((d, i) => ({ id: i, name: d, size: null, uploadedAt: Date.now() })));
    } catch {}
  };

  const deleteDocument = async (filename) => {
    try {
      await axios.delete(`${API}/delete-document/${filename}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments();
      notify("Document deleted");
    } catch { notify("Delete failed", "error"); }
  };

  const uploadFile = async () => {
    if (!file) { notify("Select a PDF first", "error"); return; }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setIsUploading(true);
      setUploadProgress(0);
      await axios.post(`${API}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      fetchDocuments();
      setFile(null);
      notify(`"${file.name}" uploaded successfully`);
    } catch { notify("Upload failed", "error"); }
    finally { setIsUploading(false); setUploadProgress(0); }
  };

  const createNewChat = () => {
    const nc = { id: uuidv4(), title: "New Chat", messages: [], createdAt: Date.now(), starred: false };
    setChats(p => [...p, nc]);
    setActiveChatId(nc.id);
    textareaRef.current?.focus();
  };

  const deleteChat = (id) => {
    setChats(p => p.filter(c => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter(c => c.id !== id);
      setActiveChatId(remaining[remaining.length - 1]?.id ?? null);
    }
  };

  const toggleStarChat = (id) => {
    setChats(p => p.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
  };

  const renameChat = (id, title) => {
    setChats(p => p.map(c => c.id === id ? { ...c, title } : c));
  };

  const updateChatMessages = useCallback((messages) => {
    setChats(p => p.map(c => c.id === activeChatId ? { ...c, messages } : c));
  }, [activeChatId]);

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    notify("Copied to clipboard");
  };

  const regenerateLastMessage = async () => {
    if (!currentChat.messages.length) return;
    const msgs = currentChat.messages;
    const lastUserMsg = [...msgs].reverse().find(m => m.type === "user");
    if (!lastUserMsg) return;
    const trimmed = msgs.slice(0, msgs.lastIndexOf(lastUserMsg) + 1).filter(m => m !== msgs[msgs.length - 1]);
    updateChatMessages(trimmed);
    await sendMessage(lastUserMsg.text, trimmed);
  };

  const sendMessage = async (text, existingMessages) => {
    const msgs = existingMessages ?? currentChat.messages;
    const userMsg = { type: "user", text, timestamp: Date.now(), model: activeModel };
    const aiMsg   = { type: "ai",   text: "", timestamp: Date.now(), model: activeModel };
    const updated = [...msgs, userMsg, aiMsg];
    updateChatMessages(updated);

    // Auto-title
    if (currentChat.title === "New Chat" || currentChat.title === "") {
      setChats(p => p.map(c => c.id === activeChatId ? { ...c, title: text.length > 32 ? text.slice(0, 32) + "…" : text } : c));
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/ask?question=${encodeURIComponent(text)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamed = "";

      while (!done) {
        const { value, done: dr } = await reader.read();
        done = dr;
        streamed += decoder.decode(value || new Uint8Array());
        setChats(p => p.map(c => c.id === activeChatId
          ? { ...c, messages: [...updated.slice(0, -1), { ...aiMsg, text: streamed }] }
          : c
        ));
      }
    } catch {
      setChats(p => p.map(c => c.id === activeChatId
        ? { ...c, messages: [...updated.slice(0, -1), { ...aiMsg, text: "⚠ Connection error. Please try again." }] }
        : c
      ));
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || loading) return;
    const q = question;
    setQuestion("");
    await sendMessage(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askQuestion(); }
  };

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportChat = () => {
    if (!currentChat) return;
    const text = currentChat.messages.map(m => `[${m.type.toUpperCase()}]: ${m.text}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${currentChat.title}.txt`;
    a.click();
    notify("Chat exported");
  };

  const clearChat = () => {
    updateChatMessages([]);
    notify("Chat cleared");
  };

  return (
    <div className={`app ${theme} font-${fontSize}`} data-theme={theme}>
      {/* Command Palette */}
      {commandOpen && (
        <CommandPalette
          chats={chats}
          documents={documents}
          onClose={() => setCommandOpen(false)}
          onSelectChat={(id) => { setActiveChatId(id); setCommandOpen(false); }}
          onNewChat={() => { createNewChat(); setCommandOpen(false); }}
          onOpenSettings={() => { setSettingsOpen(true); setCommandOpen(false); }}
          onExportChat={() => { exportChat(); setCommandOpen(false); }}
          onClearChat={() => { clearChat(); setCommandOpen(false); }}
          onToggleTheme={() => { setTheme(t => t === "dark" ? "light" : "dark"); setCommandOpen(false); }}
        />
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <SettingsPanel
          theme={theme}
          fontSize={fontSize}
          temperature={temperature}
          activeModel={activeModel}
          activePersona={activePersona}
          models={MODELS}
          personas={PERSONAS}
          onThemeChange={setTheme}
          onFontSizeChange={setFontSize}
          onTemperatureChange={setTemperature}
          onModelChange={setActiveModel}
          onPersonaChange={setActivePersona}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`toast toast--${notification.type}`}>
          <span className="toast__icon">{notification.type === "success" ? "✓" : "✕"}</span>
          {notification.msg}
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        chats={filteredChats}
        allChats={chats}
        activeChatId={activeChatId}
        searchQuery={searchQuery}
        documents={documents}
        file={file}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onToggleCollapse={() => setSidebarCollapsed(v => !v)}
        onSearchChange={setSearchQuery}
        onSelectChat={setActiveChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onStarChat={toggleStarChat}
        onRenameChat={renameChat}
        onFileChange={setFile}
        onUpload={uploadFile}
        onDeleteDocument={deleteDocument}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenCommand={() => setCommandOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")}
      />

      {/* Main */}
      <main className="main">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__left">
            {sidebarCollapsed && (
              <button className="topbar__menu-btn" onClick={() => setSidebarCollapsed(false)} title="Open sidebar">
                <span className="icon icon--menu" />
              </button>
            )}
            <div className="topbar__title">{currentChat?.title ?? "Askly"}</div>
          </div>
          <div className="topbar__center">
            <div className="model-badge">
              <span className="model-badge__dot" />
              {MODELS.find(m => m.id === activeModel)?.label}
            </div>
            <div className="persona-badge">
              {PERSONAS.find(p => p.id === activePersona)?.icon}
              {PERSONAS.find(p => p.id === activePersona)?.label}
            </div>
          </div>
          <div className="topbar__actions">
            <button className="topbar__action" onClick={exportChat} title="Export chat">⬇</button>
            <button className="topbar__action" onClick={clearChat} title="Clear chat">⊘</button>
            <button className="topbar__action topbar__action--cmd" onClick={() => setCommandOpen(true)} title="Command palette (⌘K)">
              ⌘K
            </button>
            {user && (
              <div className="topbar__user">
                <div className="topbar__avatar" title={user.email}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="topbar__username">{user.name}</span>
                <button
                  className="topbar__action topbar__logout"
                  onClick={onLogout}
                  title="Sign out"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Chat area */}
        <div className="chat-scroll">
          {(!currentChat || currentChat.messages.length === 0) ? (
            <WelcomeScreen
              personas={PERSONAS}
              activePersona={activePersona}
              onPersonaChange={setActivePersona}
              onPromptSelect={(p) => { setQuestion(p); textareaRef.current?.focus(); }}
            />
          ) : (
            <ChatArea
              messages={currentChat.messages}
              loading={loading}
              chatEndRef={chatEndRef}
              onCopy={copyMessage}
              onRegenerate={regenerateLastMessage}
            />
          )}
        </div>

        {/* Input */}
        <div className="input-zone">
          <div className="input-shell">
            <div className="input-shell__top">
              <textarea
                ref={textareaRef}
                className="input-textarea"
                placeholder={`Message ${PERSONAS.find(p => p.id === activePersona)?.label ?? "AI"}…`}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
            </div>
            <div className="input-shell__bottom">
              <div className="input-meta">
                {file && <span className="file-chip">📎 {file.name.length > 20 ? file.name.slice(0,20)+"…" : file.name}<button onClick={() => setFile(null)}>×</button></span>}
                <span className="token-count">{messageTokens > 0 ? `~${messageTokens} tokens` : ""}</span>
              </div>
              <div className="input-actions">
                <label className="input-btn input-btn--attach" title="Attach PDF">
                  ＋
                  <input type="file" hidden accept=".pdf" onChange={e => setFile(e.target.files[0])} />
                </label>
                {file && (
                  <button className="input-btn input-btn--upload" onClick={uploadFile} disabled={isUploading}>
                    {isUploading ? `${uploadProgress}%` : "Upload"}
                  </button>
                )}
                <button
                  className={`input-btn input-btn--send ${loading ? "input-btn--loading" : ""}`}
                  onClick={askQuestion}
                  disabled={loading || !question.trim()}
                  title="Send (Enter)"
                >
                  {loading ? <span className="spin">◌</span> : "↑"}
                </button>
              </div>
            </div>
          </div>
          <p className="input-hint">Enter to send · Shift+Enter for new line · ⌘K for commands</p>
        </div>

      </main>
    </div>
  );
}