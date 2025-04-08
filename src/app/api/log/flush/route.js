// @/app/api/log/flush/route.js

import logger from "@/utils/logger";
import { getUserv2 } from "@/utils/auth";

export async function POST() {
  const userData = await getUserv2();
  if (!userData?.admin) { return NextResponse.redirect(new URL("/", req.url)); }
  await logger.flush();
  return new Response("Flushed", { status: 200 });  // Todo: update admin UX
}