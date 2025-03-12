/*
*   @/app/api/book/regist/route.js
*/

// Utils
import { registerBook } from "@/utils/book/regist";

export async function POST(req) {
  try {
    const bookData = await req.json();
    if (!bookData.title || !bookData.author || !bookData.cover || !bookData.content) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), { status: 400 });  }
    const result = await registerBook(bookData);
    if (!result.success) {
      return new Response(JSON.stringify(result), { status: 500 }); }
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error processing book registration request:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}