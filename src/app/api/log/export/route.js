// @/app/api/log/export/route.js

// Next
import { NextResponse } from "next/server";
// Logger
import logger from "@/utils/logger";
// Utils
import { getUserv2 } from "@/utils/auth";
import { putDriveText } from "@/utils/drive/text";

export async function POST(req) {
  const logs = await logger.getBuffer();
  const content = logs.join("\n");

  const now = new Date(Date.now() + 9 * 3600 * 1000);
  const filename = `${now.toISOString().slice(0, 19).replace(/:/g, "")}.log`;

  const userData = await getUserv2();
  if (!userData?.admin) return NextResponse.redirect(new URL("/", req.url));
  
  const fileId = await putDriveText("server-data/log", filename, content);
  return new Response(`Exported to ${filename} (ID: ${fileId})`, { status: 200 });
}