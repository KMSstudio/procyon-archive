import { NextResponse } from "next/server";
import { loadConfig } from "@/config/configManager";

export async function GET() {
    const data = loadConfig("extLists");
    return NextResponse.json(data);
}
