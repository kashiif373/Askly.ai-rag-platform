import React, { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import { LoginPage, RegisterPage } from "./components/AuthPage";

// "login" | "register" | "app"
function App() {
  const [page,  setPage]  = useState("login");
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);

  // Restore session from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    const savedUser  = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setPage("app");
    }
  }, []);

  const handleLoginSuccess = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setPage("app");
  };

  const handleRegisterSuccess = () => {
    // After register, send them to login
    setPage("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setPage("login");
  };

  if (page === "register") {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onGoLogin={() => setPage("login")}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoRegister={() => setPage("register")}
      />
    );
  }

  // Authenticated — show the main app
  return <HomePage user={user} token={token} onLogout={handleLogout} />;
}

export default App;