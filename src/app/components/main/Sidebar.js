/* @/app/components/Sidebar.js */

import SidebarProfile from "./SidebarProfile";
import ChatRoomMain from "@/app/components/chat/ChatRoomMain";
// Style (CSS)
import "@/styles/index.css";
import "@/styles/components/main/sidebar.css";

export default function Sidebar({ isAdmin, links }) {
  return (
    <aside className="sidebar">
      {/* Profile Section */}
      <SidebarProfile isAdmin={isAdmin} />

      {/* Chat Section */}
      <div id="chat-section">
        <ChatRoomMain roomId="general" embedded />
      </div>

      <div className="special-thanks">
        <a href="/thanks">Thanks, Developers</a>
      </div>
    </aside>
  );
}
