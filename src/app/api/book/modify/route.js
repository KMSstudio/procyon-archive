/* @/app/api/book/modify/route.js */

// Next Response
import { NextResponse } from "next/server";
// Utils
import { modifyBook } from "@/utils/book/modify";

/**
 * 本のデータを更新する API エンドポイント
 * @param {Request} req - HTTP リクエストオブジェクト
 * @returns {Promise<Response>}
 */
export async function PUT(req) {
  try {
    const { bookId, data } = await req.json();
    if (!bookId || !data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid request: bookId and data are required." },
        { status: 400 }
      );
    }

    // 本のデータを更新
    await modifyBook(bookId, data);

    return NextResponse.json(
      { message: `Book ${bookId} updated successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book." },
      { status: 500 }
    );
  }
}