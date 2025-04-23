// @/app/text/page.js

// Styles (CSS)
import "@/styles/drive.css";
// Components
import NavBar from "@/app/components/NavBar";
import TextList from "@/app/components/list/TextList";
// Utils
import { getUserv2 } from "@/utils/auth";
import { getRecentDBTexts } from "@/utils/database/textDB";
import logger from "@/utils/logger";
// Constants
import navData from "@/config/navConstant.json";
import boardConfig from "@/config/board-config.json";

/**
 * 게시판 설정 및 최근 게시글 로딩
 *
 * 1. board-config.json의 각 게시판에 대해 utils/database/textDB에서 최근 게시글을 가져온다.
 * 2. 게시판 설정(config)과 recentPosts를 합쳐 [key, value] 형태로 반환한다.
 * 3. Promise.all을 통해 병렬로 처리하고, Object.fromEntries로 객체로 변환한다.
 *
 * 결과:
 * boards = {
 *   notice: {
 *     displayName: "공지 게시판",
 *     description: "...",
 *     recentPosts: [
 *       { id: "abc123", title: "공지입니다", createDate: "...", uploaderName: "...", ... }
 *     ]
 *   },
 *   forum: {
 *     displayName: "자유게시판",
 *     recentPosts: [ ... ]
 *   },
 *   ...
 * }
**/

/**
 * Load board configuration and recent posts.
 *
 * 1. For each board defined in board-config.json, fetch recent posts from utils/database/textDB.
 * 2. Combine each board's config with its recentPosts into a [key, value] pair.
 * 3. Use Promise.all for parallel fetching, then convert the result to an object via Object.fromEntries.
 *
 * Result:
 * boards = {
 *   notice: {
 *     displayName: "공지 게시판",
 *     description: "...",
 *     recentPosts: [
 *       { id: "abc123", title: "공지입니다", createDate: "...", uploaderName: "...", ... }
 *     ]
 *   },
 *   forum: {
 *     displayName: "자유게시판",
 *     recentPosts: [ ... ]
 *   },
 *   ...
 * }
**/

export default async function TextPage() {
  const userData = await getUserv2();
  logger.behavior(userData.fullName, "게시판 목록 조회");

  const boardEntries = await Promise.all(
    Object.entries(boardConfig).map(async ([boardKey, config]) => {
      try {
        const recentPosts = await getRecentDBTexts(boardKey, 5, 1);
        return [boardKey, { ...config, recentPosts }];
      } catch (err) {
        console.error(`게시판 ${boardKey} 로딩 실패`, err);
        return [boardKey, { ...config, recentPosts: [] }];
      }
    })
  );
  const boards = Object.fromEntries(boardEntries);

  return (
    <div className="main-container">
      <NavBar navs={navData.navs} />
      <div className="content-container">
        <div>
          <div id="book-head-info">
            <p>게시판 목록입니다. 각 게시판의 최근 글이 표시됩니다.</p>
          </div>
          <TextList boards={boards} />
        </div>
      </div>
    </div>
  );
}