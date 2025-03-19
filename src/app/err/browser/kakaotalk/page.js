/* app/err/browser/kakaotalk/page.js */

"use client";

export default function KakaoTalkPage() {
  const handleLinkClick = (event) => { event.preventDefault(); };

  return (
    <main id="browser-error-main-page">
      <div className="browser-error-content">
        <h1 className="title">카카오톡에서는 로그인이 불가능합니다</h1>
        <p className="message">
          더 안전한 <strong>Chrome, Safari, Samsung Internet</strong>을 이용해주세요.
        </p>
        <p className="guide">
          <strong>하단 점 세 개( ⋮ ) 클릭 → "브라우저로 열기"</strong>
        </p>

        <a href={"/"} className="link kakao" onClick={handleLinkClick} target="_blank" rel="noopener noreferrer">
          🔗 또는 꾹 눌러서 다른 브라우저로 이동하기
        </a>
      </div>
    </main>
  );
}