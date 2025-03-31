/*
 * @/app/components/Profile.js
 */

import "@/styles/components/profile.css";

export default function Profile({ image, name, email, description }) {
  return (
    <div className="profile-item">
      <img src={image} alt={name} className="profile-image" />
      <div className="profile-text">
        <h2>{name}</h2>
        <div className="description">
          {description.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}  