/* app/chat/layout.jsx */

// Components
import NavBar from "@/app/components/NavBar";
// Constants
import navData from "@/config/navConstant.json";
// Styles
import "@/styles/chat.css";

export default async function ChatLayout({ children }) {
  return (
    <div className="main-container">
      <NavBar navs={navData.navs} />
      {children}
    </div>
  );
}
