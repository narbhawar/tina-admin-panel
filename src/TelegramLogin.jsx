
import React, { useState, useEffect } from "react";

export default function TelegramLogin({ children }) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (stored === "tina_ok") setVerified(true);
  }, []);

  const handleLogin = () => {
    const input = prompt("Enter Telegram passcode:");
    if (input === "3107") {
      localStorage.setItem("admin_token", "tina_ok");
      setVerified(true);
    } else {
      alert("Wrong code");
    }
  };

  if (!verified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">🔐 Tina Admin Login</h2>
          <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login via Telegram</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
