/* @/app/api/jebo/upload/route.js */

// Util for jebo
import { jeboFile } from "@/utils/drive/jebo";
// Util for logger
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";
// Form
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import os from "os";

// Next.js 14 App Router に対応する multipart パーサ
async function parseFormDataFromWebRequest(request) {
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    throw new Error("Invalid content type");
  }

  // 10GB per form, 1GB per file.
  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    multiples: true,
    maxTotalFileSize: 10 * 1024 * 1024 * 1024,
    maxFileSize: 10 * 1024 * 1024 * 1024
  });

  const body = Buffer.from(await request.arrayBuffer());
  const stream = Readable.from(body);

  const fakeReq = Object.assign(stream, {
    headers: Object.fromEntries(request.headers.entries()),
  });

  return new Promise((resolve, reject) => {
    form.parse(fakeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// POST リクエストのハンドラ
export async function POST(req) {
  try {
    const userData = await getUserv2();
    const { fields, files } = await parseFormDataFromWebRequest(req);
    // Upload File based on Parsed Data
    const reportName = fields.reportName?.[0] || fields.reportName;
    const nickname = fields.nickname?.[0] || fields.nickname;
    const jebo_note = fields.description?.[0] || fields.description;
    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    if (!reportName || !fileArray || fileArray.length === 0) { console.warn("Invalid jebo input"); return; }
    // description
    const descriptionJSON = JSON.stringify({
      email: userData.email,
      name: userData.fullName,
      nickname: nickname,
      jebo_note,
      jebo_time: new Date(Date.now() + 9 * 3600 * 1000).toISOString(),
    }, null, 2);
    // Call jeboFile: This must be done in await.
    await jeboFile(reportName, descriptionJSON, fileArray);
    logger.query(userData.fullName, "제보")
    return new Response(JSON.stringify({ message: "Upload started" }), { status: 200 });
  }
  catch (err) { return new Response(JSON.stringify({ error: "Unexpected upload error" }), { status: 500 }); }
}