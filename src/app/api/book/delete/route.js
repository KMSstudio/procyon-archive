import { NextResponse } from "next/server";
import { deleteBook } from "@/utils/book/delete";

/**
 * 本のデータを削除する API エンドポイント
 * - POST リクエスト: JSON のボディから bookId を取得
 * - DELETE リクエスト: JSON のボディから bookId を取得
 * @param {Request} req - HTTP リクエストオブジェクト
 * @returns {Promise<Response>}
 */
export async function POST(req) { return handleDeleteRequest(req); }
export async function DELETE(req) { return handleDeleteRequest(req); }

/**
 * 本のデータを削除する共通処理
 * @param {Request} req - HTTP リクエストオブジェクト
 * @returns {Promise<Response>}
 */
async function handleDeleteRequest(req) {
  try {
    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json(
        { error: "Invalid request: bookId is required." },
        { status: 400 }
      );
    }

    // 本のデータを削除
    await deleteBook(bookId);

    return NextResponse.json(
      { message: `Book ${bookId} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book." },
      { status: 500 }
    );
  }
}