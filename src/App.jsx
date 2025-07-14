import React, { useState, useEffect } from "react";
import TelegramLogin from "./TelegramLogin";

export default function App() {
  const [drops, setDrops] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("messages");
  const [newDrop, setNewDrop] = useState({ title: "", type: "text", caption: "" });

  useEffect(() => {
    fetch("https://tina-backend.onrender.com/admin/drops")
      .then(res => res.json())
      .then(setDrops);
  }, []);

  const searchUsers = async () => {
    const res = await fetch(`https://tina-backend.onrender.com/admin/users?search=${searchTerm}&sort=${sortBy}`);
    const data = await res.json();
    setUserResults(data);
  };

  const pushDrop = async () => {
    const userId = prompt("Enter user ID to push drop to:");
    const dropId = prompt("Enter drop ID (from MongoDB _id):");
    if (!userId || !dropId) return;
    const res = await fetch("https://tina-backend.onrender.com/admin/push_drop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, drop_id: dropId })
    });
    const data = await res.json();
    alert(data.status || data.error || "Unknown response");
  };

  const createDrop = async () => {
    const res = await fetch("https://tina-backend.onrender.com/admin/create_drop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDrop)
    });
    const data = await res.json();
    alert(data.status || data.error || "Drop created");
  };

  return (
    <TelegramLogin>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Tina Admin Panel</h1>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">🔍 Search Users</h2>
          <div className="flex gap-2 mb-3">
            <input className="border px-2 py-1 flex-1" placeholder="Search by username or tag" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <select className="border px-2 py-1" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="messages">Messages</option>
              <option value="drops">Drops</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={searchUsers}>Search</button>
          </div>
          <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
            {userResults.map((u, i) => (
              <li key={i} className="border p-2 rounded bg-gray-50">
                <strong>{u.username || u.user_id}</strong><br/>
                🧠 <i>{u.memory_summary?.slice(0, 120) || 'No summary yet'}...</i><br/>
                💬 {u.message_count || 0} msgs · 🔓 {u.drop_count || 0} drops · 🏷️ {u.tags?.join(', ')}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">📦 Drops</h2>
            <button onClick={pushDrop} className="bg-purple-600 text-white px-3 py-1 rounded">📤 Push to Telegram</button>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {drops.map((drop, i) => (
              <li key={i} className="border rounded p-3 bg-gray-50">
                <strong>{drop.title || drop.type}</strong><br/>
                <span className="text-sm text-gray-600">{drop.caption || "No caption"}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">➕ Create New Drop</h2>
          <div className="grid gap-2">
            <input className="border p-2" placeholder="Drop title" value={newDrop.title} onChange={e => setNewDrop({ ...newDrop, title: e.target.value })} />
            <select className="border p-2" value={newDrop.type} onChange={e => setNewDrop({ ...newDrop, type: e.target.value })}>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="voice">Voice</option>
            </select>
            <textarea className="border p-2" placeholder="Caption or message" value={newDrop.caption} onChange={e => setNewDrop({ ...newDrop, caption: e.target.value })} />
            <button onClick={createDrop} className="bg-green-600 text-white py-2 px-4 rounded">Create Drop</button>
          </div>
        </section>
      </div>
    </TelegramLogin>
  );
}
