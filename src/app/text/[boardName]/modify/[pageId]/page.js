// @/app/text/modify/[pageId]/page.js

// Style
import "katex/dist/katex.min.css";
import "@/styles/text.css";
// Components
import ModifyCSRPage from "./csrpage";
// Utils - Text
import { getDBText } from "@/utils/database/textDB";
import { getDriveText } from "@/utils/drive/text";
// Utils - User
import { getUserv2 } from "@/utils/auth";

export default async function ModifyTextPage({ params }) {
  const { boardName, pageId } = params;

  const textData = await getDBText(boardName, pageId);
  if (!textData) { return <div className="container">We Cannot Find the Post Metadata.</div>; }
  
  const userData = await getUserv2();
  if (textData.uploaderEmail != userData.email) { return <div className="container">You don't Have Permission to Modify the Post.</div>; }

  const { title, driveId } = textData;
  const markdown = await getDriveText(driveId);
  if (!markdown) { return <div className="container">We Cannot Load the Markdown Content.</div>; }
  

  return (
    <ModifyCSRPage
      pageId={pageId}
      boardName={boardName}
      title={title}
      markdown={markdown}
    />
  );
}