/* @/app/api/jebo/upload-direct/route.js */

// Google Driveユーティリティ
import { jeboFile, jeboFileDirectly } from "@/utils/drive/jebo";
// ユーザー認証とロガー
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";
// Node.jsモジュール
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

/**
 * 족보 파일을 Google Drive에 업로드하는 API 라우트
 * 
 * 이 라우트는 `multipart/form-data` 형식의 POST 요청을 받아,
 * 사용자가 제출한 족보 파일을 Google Drive 내 `jebo/{folder}` 경로에 업로드합니다.
 * 업로드된 파일은 `{folder} {year}.{semester} {type} {comment}.{확장자}` 형식의 이름으로 저장됩니다.
 * 
 * 클라이언트는 다음의 필드를 함께 전송해야 합니다:
 * - folder: string ("컴퓨터구조.김지홍")
 * - year: number (2024)
 * - semester?: number (1)
 * - type: string ("기말", "중간")
 * - comment?: string ("해설")
 * - file: File 객체 (업로드할 실제 파일)
 * 
 * 성공 시 JSON 형식으로 `{ success: true, fileId }` 반환
 * 실패 시 `{ error: "..." }` 반환
**/
export async function POST(req) {
  try {
    const userData = await getUserv2();
    const formData = await req.formData();

    const folder = formData.get("folder");
    const year = parseInt(formData.get("year"));
    const semester = parseInt(formData.get("semester") || "0");
    const type = formData.get("type");
    const comment = formData.get("comment") || "";
    const file = formData.get("file");

    if (!folder || isNaN(year) || !type || !file || typeof file.name !== "string")
      return new Response(JSON.stringify({ error: "必須項目が不足しています" }), { status: 400 });

    const ext = file.name.split(".").pop();
    const sem = semester ? `.${semester}` : "";
    const cmnt = comment ? ` ${comment}` : "";
    const fileTitle = `${folder} ${year}${sem} ${type}${cmnt}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempFileName = `${crypto.randomUUID()}.${ext}`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);
    await fs.writeFile(tempFilePath, buffer);

    const fileObj = {
      originalFilename: file.name,
      mimetype: file.type,
      path: tempFilePath,
    };

    const descriptionJSON = JSON.stringify({
      email: userData.email,
      name: userData.fullName,
      nickname: "",
      jebo_note: `${folder} 에서 이루어진 direct 제보`,
      jebo_time: new Date(Date.now() + 9 * 3600 * 1000).toISOString(),
    }, null, 2);

    await jeboFile(`direct/${folder}`, descriptionJSON, [fileObj]);
    const fileId = await jeboFileDirectly(`exam/${folder}`, fileTitle, fileObj);
    logger.query(userData.fullName, "제보(direct)");
    return new Response(JSON.stringify({ success: true, fileId }), { status: 200 });
  } catch (err) {
    console.error("[upload-direct] アップロード失敗:", err);
    return new Response(JSON.stringify({ error: "アップロードに失敗しました" }), { status: 500 });
  }
}
