// @/app/api/text/write/route.js

// Next
import { NextResponse } from "next/server";
// Utils
import { registerText } from "@/utils/text/regist";
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";
// Constants
import boardConfig from "@/config/board-config.json";

export async function POST(req) {
  const userData = await getUserv2();
  const { boardName, title, markdown } = await req.json();
  console.log(boardName);
  logger.query(userData.fullName, "글 작성", `${title}:${boardName}`)
  if (!userData.login) { return NextResponse.json({ success: false, error: "Not authenticated" }); }
  // Check writeOnlyAdmin
  if (boardConfig[boardName]?.writeOnlyAdmin && !userData.admin) {
    return NextResponse.json({ success: false, error: "Forbidden request: admin only" }, { status: 403 }); }  
  // register Text
  try {
    const { id, driveId } = await registerText(boardName, title, markdown, userData.email, userData?.fullName || "Anonymous");
    return NextResponse.json({ success: true, id, driveId });
  }
  catch (err) { return NextResponse.json({ success: false, error: err.message }); }
}