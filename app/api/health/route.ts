import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    provider: process.env.META_API_KEY && process.env.DEMO_MODE !== "true" ? "meta" : "mock",
    model: process.env.META_MODEL ?? "Llama-4-Maverick-17B-128E-Instruct-FP8",
    timestamp: new Date().toISOString(),
  });
}
