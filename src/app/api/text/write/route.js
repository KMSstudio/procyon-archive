// @/app/api/text/write/route.js

// Utils
import { registerText } from "@/utils/text/regist";
import { getUserv2 } from "@/utils/auth";
// Response
import { NextResponse } from "next/server";

export async function POST(req) {
  const userData = await getUserv2();
  const { boardName, title, markdown } = await req.json();
  console.log(boardName);

  console.log("aaa");

  if (!userData.login) { return NextResponse.json({ success: false, error: "Not authenticated" }); }
  
  console.log("bbb");

  try {
    console.log("ccc");
    const { id, driveId } = await registerText(
      boardName,
      title,
      markdown,
      userData.email,
      userData?.fullName || "Anonymous"
    );
    console.log("ddd");
    return NextResponse.json({ success: true, id, driveId });
  }
  catch (err) { return NextResponse.json({ success: false, error: err.message }); }
}