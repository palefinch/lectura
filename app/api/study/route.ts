import { NextResponse } from "next/server";
import { generateStudyPack } from "@/lib/ai/provider";
import type { ApiError, Lang, StudyRequest, StudyResponse } from "@/lib/types";

export const runtime = "nodejs";

function isLang(value: unknown): value is Lang {
  return value === "ro" || value === "ru";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<StudyRequest>;
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const lang = isLang(body.lang) ? body.lang : "ro";
    const title = typeof body.title === "string" ? body.title : undefined;

    if (text.length < 40) {
      return NextResponse.json<ApiError>(
        { error: "Add at least a few sentences of lecture text." },
        { status: 400 },
      );
    }

    const result = await generateStudyPack({ text, lang, title });
    return NextResponse.json<StudyResponse>(result);
  } catch (error) {
    console.error("[study] failed", error);
    return NextResponse.json<ApiError>(
      { error: "Could not build the study pack. Try again." },
      { status: 500 },
    );
  }
}
