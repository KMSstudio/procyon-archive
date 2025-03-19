/* app/err/browser/kakaotalk/page.js */

"use client";

export default function KakaoTalkPage() {
  const handleCopyLink = () => {
    const link = "https://procyon-omega.vercel.app";
    navigator.clipboard.writeText(link)
      .then(() => alert("링크가 복사되었습니다!"))
      .catch(() => alert("복사에 실패했습니다."));
  };

  return (
    <main id="browser-error-main-page">
      <div className="browser-error-content">
        <h1 className="title">에브리타임에서는 로그인이 불가능합니다</h1>
        <p className="message">
          더 안전한 <strong>Chrome, Safari, Samsung Internet</strong>을 이용해주세요.
        </p>
        <p className="guide">
          <strong>오른쪽 상단 점 세 개( ⋮ ) 클릭 → "브라우저에서 열기"</strong>
        </p>

        <a href={"/"} className="link every" onClick={handleCopyLink}>
          🔗 또는 접속 링크 복사하기
        </a>
      </div>
    </main>
  );
}