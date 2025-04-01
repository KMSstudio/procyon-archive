/* @/app/api/drive/export/[fileid]/route.js */

// Next Response
import { NextResponse } from "next/server";
// Utilities
import { exportDriveFile } from "@/utils/drive/export";

export async function GET(req, { params }) {
  try {
    const fileId = params.fileid;
    const result = await exportDriveFile(fileId);
    if (!result) return NextResponse.json({ error: "File not found." }, { status: 404 });

    return new Response(result.stream, { headers: result.headers });
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}