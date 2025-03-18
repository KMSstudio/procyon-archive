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
          <p>본 프로젝트는 서울대학교 컴퓨터공학부 내에서 정보 공유의 불균형을 해소하고, 더욱 긴밀한 선후배 간 네트워크를 형성하는 것을 목표로 합니다. 
학부 내에서 필수적인 학습 자료조차 개인 단위에서 단절적으로 공유되는 경우가 많아, 이에 대한 통합적인 플랫폼이 필요하다는 문제의식에서 출발하였습니다.

이와 더불어, 타 대학처럼 강한 유대감을 형성하는 학문 공동체를 지향하며, 선배가 후배를 자연스럽게 돕고, 후배는 또다시 다음 세대를 위해 지식을 남길 수 있는 순환적인 문화가 정착되기를 바랍니다. 
적어도 학업과 연구에 필요한 자료 공유만큼은 보다 적극적으로 이루어질 수 있도록, 이 플랫폼이 활성화되기를 바랍니다.
</p>
        </div>
      </div>
    </div>
  );
}