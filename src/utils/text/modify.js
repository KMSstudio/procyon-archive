import { getDriveText, putDriveText } from "@/utils/drive/text";
import { updateDBText, getDBText } from "@/utils/database/textDB";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

export async function modifyText(boardName, textId, newTitle, newMarkdown, lastModifyerName, lastModifyerEmail, archived = true) {
  if (!boardName || !textId) throw new Error("boardName and textId are required.");
  const doc = await getDBText(boardName, textId);
  if (!doc || !doc.driveId) throw new Error("Cannot find document or driveId.");

  const driveId = doc.driveId;

  // === Archiving logic ===
  if (archived && (newTitle !== undefined || newMarkdown !== undefined)) {
    const originalMarkdown = await getDriveText(driveId);
    if (!originalMarkdown) throw new Error("Failed to read original text for archiving.");

    const now = new Date();
    const nowISO = now.toISOString();

    const titleOld = doc.title || "";
    const titleNew = newTitle || titleOld;

    const header = [
      "---",
      `Page  ID\t${doc.id}  `,
      `Title Old\t${titleOld}  `,
      `Title New\t${titleNew}  `,
      `Uploader\t${doc.uploaderName}(${doc.uploaderEmail})  `
      `Last Modyfier\t${doc.lastModifyerName}(${doc.lastModifyerEmail})  `,
      `Modifyed by\t${lastModifyerName}(${lastModifyerEmail})  `,
      `Created At\t${doc.createDate}  `,
      `Archived at\t${nowISO}  `,
      "---"
    ].join("\n");

    const archiveContent = `${header}\n\n${originalMarkdown}`;
    const archiveName = `${textId}(${titleOld.slice(0, 20)}...) - mdf at ${nowISO}.md`;

    await putDriveText("text/archived", archiveName, archiveContent);
  }

  // === Actual update ===
  const updateTasks = [];
  // Markdown content update
  if (newMarkdown !== undefined) {
    updateTasks.push(
      drive.files.update({
        fileId: driveId,
        media: {
          mimeType: "text/markdown",
          body: Buffer.from(newMarkdown, "utf-8"),
        },
      })
    );
  }

  // Metadata update
  updateTasks.push(
    updateDBText(boardName, textId, {
      title: newTitle,
      lastModifyerName,
      lastModifyerEmail,
      lastModifiedDate: new Date().toISOString(),
    })
  );

  await Promise.all(updateTasks);
}