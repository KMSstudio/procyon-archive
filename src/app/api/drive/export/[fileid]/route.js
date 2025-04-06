/* @/app/api/drive/export/[fileid]/route.js */

// Next Response
import { NextResponse } from "next/server";
// Utilities
import { exportDriveFile } from "@/utils/drive/export";
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";

export async function GET(req, { params }) {
  try {
    const userData = await getUserv2();
    const fileId = params.fileid;
    const result = await exportDriveFile(fileId);
    
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("name");

    if (fileName) { logger.info(`「${userData.fullName}」가 ${fileName}를 다운로드받았습니다.`); }
    else { logger.info(`「${userData.fullName}」가 ${fileId}를 다운로드받았습니다.`); }
    if (!result) return NextResponse.json({ error: "File not found." }, { status: 404 });

    return new Response(result.stream, { headers: result.headers });
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}