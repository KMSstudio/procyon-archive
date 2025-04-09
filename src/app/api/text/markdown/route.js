/* @/app/api/text/markdown/route.js */

import { NextResponse } from "next/server";
import { parseMarkdown } from "@/utils/markdown";

export async function POST(req) {
  try {
    const { markdown } = await req.json();
    const html = await parseMarkdown(markdown || "");
    return NextResponse.json({ success: true, html });
  }
  catch (error) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}