// @/app/api/log/flush/route.js

import logger from "@/utils/logger";

export async function POST() {
  await logger.flush();
  return new Response("Flushed", { status: 200 });
}