"use client";

/*
 * @/app/components/unique/AdminUserSection.js
*/

import { useState } from "react";
import "@/styles/components/admin/usersection.css";

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
            src="/image/ico/admin-user-section/terminal.png" 
            alt="Admin Icon" 
            className="user-icon" 
          />
          <div className="user-info">
            <p className="user-email">total <span style={{color: "rgb(247, 143, 30)"}}>{filteredUsers.length}</span> users are found</p>
            <p className="user-last-access">console</p>
          </div>
        </div>

        {/* Existing User Items */}
        {filteredUsers.map((user) => (
          <div key={user.email} className="user-item">
            <img 
              src={
                user.isAdmin
                  ? "/image/ico/admin-user-section/admin.png"
                  : user.isPrestige
                  ? "/image/ico/admin-user-section/prestige.png"
                  : "/image/ico/admin-user-section/user.png"
              }
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