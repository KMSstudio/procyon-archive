"use client";

import { useState } from "react";
import "@/app/styles/components/unique/adminusersection.css";

export default function UserSection({ users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="user-section">
      <h2>User List</h2>

      {/* User List */}
      <div className="user-list">
        {filteredUsers.map((user) => (
          <div key={user.email} className="user-item">
            <img 
              src={user.isAdmin ? "/image/ico/user-list/admin.png" : "/image/ico/user-list/user.png"} 
              alt="User Icon" 
              className="user-icon"
            />
            <div className="user-info">
              <p className="user-email">{user.email}</p>
              <p className="user-last-access">{user.lastAccessDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="user-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </section>
  );
}