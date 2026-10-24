import { NextResponse } from "next/server";
import { extractPdf } from "@/lib/pdf";
import type { ApiError, ExtractResponse, Lang } from "@/lib/types";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;

function isLang(value: FormDataEntryValue | null): value is Lang {
  return value === "ro" || value === "ru";
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json<ApiError>({ error: "Missing PDF file." }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json<ApiError>({ error: "The PDF is empty." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json<ApiError>(
        { error: "The PDF is larger than 15 MB." },
        { status: 413 },
      );
    }
    if (file.type && file.type !== "application/pdf") {
      return NextResponse.json<ApiError>({ error: "Only PDF files are supported." }, { status: 415 });
    }

    const language: Lang = isLang(form.get("lang")) ? (form.get("lang") as Lang) : "ro";
    const buffer = await file.arrayBuffer();
    const { pages, text } = await extractPdf(buffer);

    if (text.replace(/\s+/g, "").length < 40) {
      return NextResponse.json<ApiError>(
        {
          error:
            "No selectable text found. This looks like a scanned PDF; OCR is on the roadmap.",
        },
        { status: 422 },
      );
    }

    const document: ExtractResponse["document"] = {
      id: crypto.randomUUID(),
      name: file.name,
      pages,
      chars: text.length,
      language,
      text: text.slice(0, 80_000),
    };

    return NextResponse.json<ExtractResponse>({ document });
  } catch (error) {
    console.error("[extract] failed", error);
    return NextResponse.json<ApiError>({ error: "Could not read this PDF." }, { status: 500 });
  }
}
