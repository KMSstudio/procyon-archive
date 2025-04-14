/* @/app/thanks/page.js */

// Components
import NavBar from "@/app/components/NavBar";
import Profile from "@/app/components/Profile";
// Constants
import profiles from "@/config/developer-list.json";
import contributors from "@/config/contributor-list.json";
import navData from "@/config/navConstant.json";
// Style (CSS)
import "@/styles/thanks.css";
// Utils
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";

export const metadata = {
  title: "개발자정보",
  description: "CSE:Archive의 관리자 신시우는 서버의 최초 구상자이며 모든 권한을 가지고 있습니다. 하지만, 직접적인 관여는 하지 않을 예정입니다. 명왕성은 컨텐츠 생성 및 관리 권한을 갖고 있으며, 소스코드 유지보수를 담당하고 있습니다.",
};

export default async function ThanksPage() {
  const { navs = [] } = navData;
  getUserv2().then(userData => {
    logger.info(`${userData.fullName} 가 개발자 소개 페이지를 열었습니다.`);
  })

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
        <div id="server-info">
          <p className="server-version">procyon 0.7.0</p>
          <p className="server-message">
            모든 정보는 서울대학교 컴퓨터공학과에게 공개됩니다. 컴퓨터공학과 내에서 정보 격차는 존재해서는 안 됩니다.
          </p>
        </div>

        {/* Contributor Section */}
        <div id="contributor-section">
          <div className="contributor-grid">
            {contributors.map((contributor, index) => (
              <div key={index} className="contributor-item">
                <img src={contributor.image} alt="Profile" className="contributor-image" />
                <div className="contributor-text">
                  <p className="contributor-name">
                    {contributor.name}
                    <span className="alias-tag">({contributor.alias})</span>
                  </p>
                  <p className="contributor-role">{contributor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}