/* @/app/text/page.js */

// Styles (CSS)
import "@/styles/drive.css";

// Components
import TextList from "@/app/components/list/TextList";

// Utils
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";

// 임시 데이터 (예시)
const dummyBoards = {
  notice: {
    displayName: "공지 게시판",
    writeOnlyAdmin: true,
    modifyOnlyAuthor: true,
    recentPosts: [
      { id: "n1", title: "중요한 일정 공지", lastModifiedDate: "2025-04-20T12:00:00Z" },
      { id: "n2", title: "서비스 점검 안내", lastModifiedDate: "2025-04-18T08:00:00Z" },
    ],
  },
  forum: {
    displayName: "자유게시판",
    writeOnlyAdmin: false,
    modifyOnlyAuthor: true,
    recentPosts: [
      { id: "f1", title: "CSE 학우분들 안녕하세요", lastModifiedDate: "2025-04-21T09:30:00Z" },
      { id: "f2", title: "시험 끝나고 뭐 하시나요?", lastModifiedDate: "2025-04-19T11:00:00Z" },
    ],
  },
  inform: {
    displayName: "정보게시판",
    writeOnlyAdmin: false,
    modifyOnlyAuthor: true,
    recentPosts: [
      { id: "f1", title: "CSE 학우분들 안녕하세요", lastModifiedDate: "2025-04-21T09:30:00Z" },
      { id: "f2", title: "시험 끝나고 뭐 하시나요?", lastModifiedDate: "2025-04-19T11:00:00Z" },
    ],
  },
  guardian: {
    displayName: "정보게시판",
    writeOnlyAdmin: false,
    modifyOnlyAuthor: true,
    recentPosts: [
      { id: "f1", title: "CSE 학우분들 안녕하세요", lastModifiedDate: "2025-04-21T09:30:00Z" },
      { id: "f2", title: "시험 끝나고 뭐 하시나요?", lastModifiedDate: "2025-04-19T11:00:00Z" },
    ],
  },
};

export default async function TextPage() {
  const userData = await getUserv2();
  logger.behavior(userData.fullName, "게시판 목록 조회");

  return (
    <div className="content-container">
      <div>
        <div id="book-head-info">
          <p>이 게시판은 임시 데이터로 구성되어 있습니다. 실제 게시글은 곧 연결될 예정입니다.</p>
        </div>
        <TextList boards={dummyBoards} />
      </div>
    </div>
  );
}
