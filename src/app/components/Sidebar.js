"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

import "../styles/index.css";
import "../styles/sidebar.css";

export default function Sidebar({ isAdmin, links }) {
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
    navigator.clipboard.writeText(text).then(() => alert(`Copy Link!`)).catch(() => alert("복사 실패"));
  };

  return (
    <aside className="sidebar">
      <div id="profile-section">
        {/* Profile Image */}
        <div ref={profileImageContainerRef} className="profile-circle">
          <Image
            src="/image/profile/snu-logo.png"
            alt="프로필 이미지"
            width={150}
            height={150}
            className="profile-image"
            unoptimized
          />
        </div>

        {/* Profile Buttons */}
        <div className="profile-info">
          {isAdmin && (
            <button className="profile-button" onClick={() => window.location.href = "/admin"}>
              <img src="/image/ico/admin.png" alt="admin" className="profile-icon" />
              <img src="/image/ico/admin-hover.png" alt="admin hover" className="profile-hover-icon" />
            </button>
          )}

          <button className="profile-button" onClick={() => copyToClipboard("tomskang@naver.com")}>
            <img src="/image/ico/open-mail.png" alt="email" className="profile-icon" />
            <img src="/image/ico/open-mail-hover.png" alt="email hover" className="profile-hover-icon" />
          </button>

          <button className="profile-button" onClick={() => window.open("https://github.com/KMSstudio", "_blank")}>
            <img src="/image/ico/github.png" alt="github" className="profile-icon" />
            <img src="/image/ico/github-hover.png" alt="github hover" className="profile-hover-icon" />
          </button>
        </div>
      </div>

      <div id="link-section">
        <div className="link-list">
          {links.map((link, index) => (
            <div key={index} className="link-item">
              {/* Copy Button */}
              <button className="copy-button" onClick={() => copyToClipboard(link.href)}>
                <img src="/image/ico/copy.png" alt="복사 버튼" className="copy-icon" />
                <img src="/image/ico/copy-hover.png" alt="복사 버튼 hover" className="copy-hover-icon" />
              </button>
              {/* Link Info */}
              <div className="link-info">
                <img src={link.src} alt={link.name} className="link-icon" />
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}