// @/app/api/drive/show/route.js

import { getDriveFiles } from "@/utils/drive/show";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return new Response(JSON.stringify({ error: "Missing 'path' query parameter." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const files = await getDriveFiles(path);
    return new Response(JSON.stringify(files), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in /api/drive/show:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}