/* @/app/components/SidebarProfile.jsx */

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function SidebarProfile({ isAdmin }) {
  const profileImageContainerRef = useRef(null);

  useEffect(() => {
    const profileContainer = profileImageContainerRef.current;
    if (!profileContainer) return;

    const profileImage = profileContainer.querySelector("img");
    if (!profileImage) return;

    const handleMouseMove = (event) => {
      const rect = profileImage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      profileImage.style.transformOrigin = `${x}px ${y}px`;
    };

    profileImage.addEventListener("mousemove", handleMouseMove);
    return () => profileImage.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Copy Link!"))
      .catch(() => alert("복사 실패"));
  };

  return (
    <div id="profile-section">
      <div ref={profileImageContainerRef} className="mainpage-profile-circle">
        <Image
          src="/profile/main.png"
          alt="프로필 이미지"
          width={150}
          height={150}
          className="mainpage-profile-image"
          unoptimized
        />
      </div>

      <div className="profile-info">
        {isAdmin && (
          <button className="profile-button" onClick={() => window.location.href = "/admin"}>
            <img src="/image/ico/sidebar/admin.png" alt="admin" className="profile-icon" />
            <img src="/image/ico/sidebar/admin-hover.png" alt="admin hover" className="profile-hover-icon" />
          </button>
        )}

        <button className="profile-button" onClick={() => copyToClipboard("tomskang@naver.com")}>
          <img src="/image/ico/sidebar/open-mail.png" alt="email" className="profile-icon" />
          <img src="/image/ico/sidebar/open-mail-hover.png" alt="email hover" className="profile-hover-icon" />
        </button>

        <button className="profile-button" onClick={() => window.open("https://github.com/KMSstudio/procyon-archive", "_blank")}>
          <img src="/image/ico/sidebar/github.png" alt="github" className="profile-icon" />
          <img src="/image/ico/sidebar/github-hover.png" alt="github hover" className="profile-hover-icon" />
        </button>
      </div>
    </div>
  );
}
