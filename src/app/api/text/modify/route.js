// @/app/api/text/modify/route.js

// Next
import { NextResponse } from "next/server";
// Utils
import { modifyText } from "@/utils/text/modify";
import { getUserv2 } from "@/utils/auth";
import { getDBText } from "@/utils/database/textDB";
// Constants
import boardConfig from "@/config/board-config.json";

export async function POST(req) {
  try {
    const body = await req.json();
    const { boardName, textId, newTitle, newMarkdown } = body;
    if (!boardName || !textId) { return NextResponse.json({ error: "Missing boardName or textId" }, { status: 400 }); }
    // Get current user info
    const user = await getUserv2();
    const userEmail = user?.email;
    if (!userEmail) { NextResponse.json({ error: "Unauthorized: Cannot find user email" }, { status: 401 }); }
    // Load post metadata
    const textData = await getDBText(boardName, textId);
    if (!textData) { return NextResponse.json({ error: "Post not found" }, { status: 404 }); }
    // Authorization check: user must be the uploader
    if (boardConfig[boardName]?.modifyOnlyAuthor && textData.uploaderEmail !== userEmail) { 
      return NextResponse.json({ error: "Forbidden: You are not the author" }, { status: 403 }); }
    // Proceed with update
    await modifyText(boardName, textId, newTitle, newMarkdown, user.fullName, user.email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/text/modify:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
