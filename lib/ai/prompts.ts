import { demoPack } from "../demo";
import type { Lang, StudyPack } from "../types";

const MAX_INPUT = Number(process.env.MAX_INPUT_CHARS ?? 24000);

export function systemPrompt(lang: Lang): string {
  const language = lang === "ro" ? "Romanian" : "Russian";
  return [
    "You are Lectura, a study assistant for students in Moldova.",
    `Write every user-facing string in ${language}.`,
    "You transform lecture notes into a compact study pack.",
    "Be faithful to the source: never invent facts that are not supported by the text.",
    "If a page number is impossible to infer, omit it.",
    "Return ONLY a valid JSON object, with no markdown fences and no commentary.",
    'Schema: {"title":string,"summary":string,"keyPoints":[{"text":string,"page"?:number}],"flashcards":[{"question":string,"answer":string,"page"?:number}],"quiz":[{"question":string,"options":[string,string,string,string],"correct":0-3,"explanation":string,"page"?:number}],"terms":[{"term":string,"definition":string}]}',
    "Use 3–6 key points, 4–6 flashcards, 3–5 quiz questions and 2–6 terms.",
  ].join("\n");
}

export function userPrompt(text: string, lang: Lang, title?: string): string {
  const clipped = text.slice(0, MAX_INPUT);
  return [
    title ? `Document title: ${title}` : "Document title: unknown",
    "Lecture text:",
    "<<<",
    clipped,
    ">>>",
    `Build the study pack in ${lang === "ro" ? "Romanian" : "Russian"}.`,
  ].join("\n");
}

function normalize(text: string): string {
  return text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function splitSentences(text: string): string[] {
  const normalized = normalize(stripLeadingTitle(text)).replace(/\n+/g, " ");
  const matches = normalized.match(/[^.!?…]+[.!?…]+["»”]?/g) ?? [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function stripLeadingTitle(text: string): string {
  const lines = normalize(text).split("\n").filter(Boolean);
  if (lines.length < 2) return text;
  const first = lines[0].trim();
  const isShortHeading =
    first.length <= 100 &&
    !/[.!?…]$/.test(first) &&
    first.split(/\s+/).length <= 10;
  return isShortHeading ? lines.slice(1).join("\n") : text;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trim()}…`;
}

function looksLikeDemo(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("învățarea automată") ||
    lower.includes("машинное обучение") ||
    lower.includes("supraînvățare") ||
    lower.includes("переобучение")
  );
}

export function buildMockPack(text: string, lang: Lang, title?: string): StudyPack {
  if (looksLikeDemo(text)) return demoPack(lang);

  const sentences = splitSentences(text)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 35)
    .slice(0, 18);

  if (sentences.length < 4) return demoPack(lang);

  // The mock has no page map. Inventing page numbers would make citations
  // look authoritative when they are not, so we omit them.
  const keyPoints = sentences.slice(0, 5).map((sentence) => ({
    text: clip(sentence, 220),
  }));

  const summary = clip(sentences.slice(0, 3).join(" "), 520);
  const terms = keyPoints.slice(0, 4).map((point) => {
    const words = point.text.split(/\s+/).filter((word) => word.length > 6);
    const term = (words[0] ?? point.text.split(" ")[0] ?? "Concept").replace(
      /[,.;:!?]+$/,
      "",
    );
    return {
      term: clip(term, 48),
      definition: clip(point.text, 220),
    };
  });

  const flashcards = keyPoints.slice(0, 5).map((point, index) => ({
    question:
      lang === "ro"
        ? `Ce idee importantă apare în lecție? (${index + 1})`
        : `Какая важная идея есть в лекции? (${index + 1})`,
    answer: point.text,
  }));

  const quiz = keyPoints.slice(0, 4).map((point, index) => {
    const correct = point.text;
    const distractors =
      lang === "ro"
        ? [
            "Această afirmație nu este susținută de text.",
            "Textul spune exact opusul.",
            "Este o definiție inventată, fără legătură cu lecția.",
          ]
        : [
            "Это утверждение не подтверждается текстом.",
            "В тексте говорится прямо противоположное.",
            "Это выдуманное определение, не связанное с лекцией.",
          ];
    const options = [correct, ...distractors];
    const shift = index % 4;
    const rotated = options.map((_, optionIndex) => options[(optionIndex + shift) % 4]);
    return {
      question:
        lang === "ro"
          ? "Care afirmație este susținută de text?"
          : "Какое утверждение подтверждается текстом?",
      options: rotated.map((option) => clip(option, 160)),
      correct: rotated.indexOf(correct),
      explanation:
        lang === "ro"
          ? "Varianta corectă reproduce o idee din text; celelalte sunt distractori generați pentru demo."
          : "Верный вариант повторяет идею из текста; остальные — дистракторы, сгенерированные для демо.",
    };
  });

  return {
    title: clip(
      title?.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ") ??
        (lang === "ro" ? "Lecție fără titlu" : "Лекция без названия"),
      120,
    ),
    summary,
    keyPoints,
    flashcards,
    quiz,
    terms,
  };
}
