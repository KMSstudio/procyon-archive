// @/app/api/drive/exam/count/route.js

// Utils
import { countView } from "@/utils/exam/examStats";
// Next
import { NextResponse } from "next/server";

/**
 * POST /api/drive/exam/count
 * - 試験名を受け取り、閲覧数を1つカウントする
 * - レスポンスを待たない設計のため、完了のみ返す
*/
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (typeof name === "string" && name.length > 0) await countView(name);
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 400 });
  }
}