import type { Lang, StudyPack } from "../types";
import { buildMockPack, systemPrompt, userPrompt } from "./prompts";
import { studyPackSchema } from "./schema";

export type StudyResult = {
  pack: StudyPack;
  provider: "meta" | "mock";
};

function extractJson(content: string): unknown {
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Provider returned no JSON object");
  }
  return JSON.parse(trimmed.slice(start, end + 1));
}

async function callMeta(text: string, lang: Lang, title?: string): Promise<StudyPack> {
  const apiKey = process.env.META_API_KEY;
  if (!apiKey) throw new Error("META_API_KEY is not configured");

  const baseUrl = (process.env.META_API_BASE_URL ?? "https://api.llama.com/compat/v1").replace(
    /\/+$/,
    "",
  );
  const model = process.env.META_MODEL ?? "Llama-4-Maverick-17B-128E-Instruct-FP8";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 3500,
      messages: [
        { role: "system", content: systemPrompt(lang) },
        { role: "user", content: userPrompt(text, lang, title) },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Meta provider ${response.status}: ${detail.slice(0, 300)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Meta provider returned an empty message");

  const parsed = studyPackSchema.safeParse(extractJson(content));
  if (!parsed.success) {
    throw new Error(`Meta provider returned an invalid pack: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function generateStudyPack(input: {
  text: string;
  lang: Lang;
  title?: string;
}): Promise<StudyResult> {
  const { text, lang, title } = input;
  const useMock = process.env.DEMO_MODE === "true" || !process.env.META_API_KEY;

  if (!useMock) {
    try {
      return { pack: await callMeta(text, lang, title), provider: "meta" };
    } catch (error) {
      console.warn("[lectura] Meta provider failed; using the mock pack.", error);
    }
  }

  return { pack: buildMockPack(text, lang, title), provider: "mock" };
}
