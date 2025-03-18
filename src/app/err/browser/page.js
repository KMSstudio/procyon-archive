"use client";

export default function InvalidBrowserPage() {
  const openInCorrectBrowser = () => {
    const url = "http://192.168.229.197:3000"; // 현재 프로젝트의 메인 페이지
    console.log(url);

    // 사용자 기기의 User-Agent 확인
    const userAgent = navigator.userAgent.toLowerCase();
    const isSamsung = userAgent.includes("samsung"); // 삼성 기기
    const isIOS = /iphone|ipad|ipod/.test(userAgent); // iOS 기기
    console.log(userAgent);

    if (isIOS) {
      // iPhone / iPad -> Safari
      window.location.href = url;
    } else {
      // Samsung Device -> Samsung Internet
    //   const samsungInternetUrl = `samsunginternet://navigate?url=${encodeURIComponent(url)}`;
    //   window.location.href = samsungInternetUrl;
      window.open("https://www.naver.com", "_blank");

      // 일정 시간 후에도 이동하지 않으면 Play Store로 이동
      setTimeout(() => {
        window.location.href = "https://play.google.com/store/apps/details?id=com.sec.android.app.sbrowser";
      }, 2000);
    }
  };

  return (
    <main id="invalid-browser-main-page">
      <h1>This browser is not supported.</h1>
      <p>Please use Chrome, Samsung Internet, or Safari.</p>
      <button onClick={openInCorrectBrowser}>
        <img src="/image/ico/browser.png" alt="Browser Icon" className="browser-icon" />
        Open in Supported Browser
      </button>
    </main>
  );
}
