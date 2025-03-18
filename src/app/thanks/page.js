/*
 * @/app/thanks/page.js
 */

// Components
import NavBar from "@/app/components/NavBar";
import Profile from "@/app/components/Profile";
// Constants
import profiles from "@/config/profile-list.json";
import navData from "@/config/navConstant.json";
// Style (CSS)
import "@/app/styles/thanks.css";

export default function ThanksPage() {
  const { navs = [] } = navData;

  return (
    <div className="main-container">
      <NavBar navs={navs} />

      <div className="thanks-content-container">
        {/* Title Section */}
        <div className="title-section">
          <div className="title-background">
            <img src="/image/logo/full-white.png" alt="Logo" className="title-logo default-logo" />
            <img src="/image/logo/highlight-white.png" className="title-logo hover-logo" />
            <img src="/image/logo/remove-halo-white.png" className="title-logo" />
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          {profiles.map((profile, index) => (
            <Profile
              key={index}
              image={profile.image}
              name={profile.name}
              email={profile.email}
              description={profile.description}
            />
          ))}
        </div>

        {/* Server Information */}
        <div className="server-info">
          <p>procyon 0.3.2</p>
          <p>모든 정보는 서울대학교 컴퓨터공학과에게 공개됩니다. 컴퓨터공학과 내에서의 정보 격차는, 존재해서는 안 됩니다.</p>
        </div>
      </div>
    </div>
  );
}