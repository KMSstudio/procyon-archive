/* @/app/api/jebo/upload/route.js */

import { jeboFile } from "@/utils/drive/jebo";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import os from "os";

// Next.js 14 App Router に対応する multipart パーサ
async function parseFormDataFromWebRequest(request) {
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    throw new Error("Invalid content type");
  }

  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    multiples: true,
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
    const { fields, files } = await parseFormDataFromWebRequest(req);

    const reportName = fields.reportName?.[0] || fields.reportName;
    const description = fields.description?.[0] || fields.description;
    const fileArray = Array.isArray(files.files) ? files.files : [files.files];

    if (!reportName || !fileArray || fileArray.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 }); }
    await jeboFile(reportName, description || "", fileArray);
    return new Response(JSON.stringify({ message: "Upload success" }), { status: 200 });
  } catch (err) {
    console.error("Jebo Upload Error:", err);
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
  }
}