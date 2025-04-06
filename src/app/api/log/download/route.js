// @/app/api/log/download/route.js

import logger from "@/utils/logger";
import { NextResponse } from "next/server";

export async function GET() {
  const logs = await logger.getBuffer();
  const content = logs.join("\n");

  const now = new Date(Date.now() + 9 * 3600 * 1000);
  const filename = `${now.toISOString().slice(0, 19).replace(/:/g, "")}.log`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}