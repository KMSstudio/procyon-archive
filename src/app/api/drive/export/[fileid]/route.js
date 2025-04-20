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

    if (!userData?.login) { return NextResponse.redirect(new URL("/err/login/nodata", req.url)); }

    if (fileName) { logger.query(userData.fullName, "다운로드", `${fileName}:${fileId}`) }
    else { logger.query(userData.fullName, "다운로드", `?:${fileId}`) }
    if (!result) return NextResponse.json({ error: "File not found." }, { status: 404 });

    return new Response(result.stream, { headers: result.headers });
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}