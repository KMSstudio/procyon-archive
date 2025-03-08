import { NextResponse } from "next/server";
import { loadConfig } from "@/config/configManager";

export async function GET() {
    const data = loadConfig("navConstant");
    return NextResponse.json(data);
}