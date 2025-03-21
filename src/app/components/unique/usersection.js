"use client";

/*
 * @/app/components/unique/AdminUserSection.js
*/

import { useState } from "react";
import "@/app/styles/components/unique/usersection.css";

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
        {/* Total Summary Item */}
        <div className="user-item">
          <img 
            src="/image/ico/user-list/terminal.png" 
            alt="Admin Icon" 
            className="user-icon" 
          />
          <div className="user-info">
            <p className="user-email">total {filteredUsers.length} users are found</p>
            <p className="user-last-access">console</p>
          </div>
        </div>

        {/* Existing User Items */}
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