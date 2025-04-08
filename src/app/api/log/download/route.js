// @/app/api/log/download/route.js

import logger from "@/utils/logger";
import { getUserv2 } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const logs = await logger.getBuffer();
  const content = logs.join("\n");

  const now = new Date(Date.now() + 9 * 3600 * 1000);
  const filename = `${now.toISOString().slice(0, 19).replace(/:/g, "")}.log`;
  
  const userData = await getUserv2();
  if (!userData?.admin) { return NextResponse.redirect(new URL("/", req.url)); }

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}