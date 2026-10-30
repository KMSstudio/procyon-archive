import { redis } from "@/utils/database/redis";

export async function GET() {
  await redis.set("test:redis", "ok", { ex: 60 });
  const value = await redis.get("test:redis");
  return Response.json({ value });
}
