import { describe, expect, it } from "vitest";
import { buildMockPack, systemPrompt } from "@/lib/ai/prompts";
import { studyPackSchema } from "@/lib/ai/schema";
import { demoPack, demoText } from "@/lib/demo";

describe("demo packs", () => {
  it("are valid study packs in both languages", () => {
    for (const lang of ["ro", "ru"] as const) {
      const result = studyPackSchema.safeParse(demoPack(lang));
      expect(result.success).toBe(true);
    }
  });

  it("keeps the mock deterministic for the demo lecture", () => {
    const ro = buildMockPack(demoText("ro"), "ro", "demo.pdf");
    expect(ro.title).toBe("Introducere în învățarea automată");
    expect(ro.flashcards.length).toBeGreaterThanOrEqual(4);
    expect(ro.quiz.every((question) => question.options.length === 4)).toBe(true);
  });
});

describe("buildMockPack", () => {
  const text = [
    "Machine learning models learn patterns from data instead of following hand-written rules.",
    "A validation split is kept separate from the training set so overfitting can be detected.",
    "Accuracy alone can hide class imbalance when one class dominates the dataset.",
    "A simple model trained on clean data often beats a complex model trained on noisy data.",
    "The loss function measures how far a prediction is from the expected value.",
  ].join(" ");

  it("creates a usable fallback pack from arbitrary lecture text", () => {
    const pack = buildMockPack(text, "ru", "lecture-02.pdf");
    expect(pack.title).toBe("lecture 02");
    expect(pack.keyPoints.length).toBeGreaterThanOrEqual(3);
    expect(pack.flashcards.length).toBeGreaterThanOrEqual(3);
    expect(pack.quiz.length).toBeGreaterThanOrEqual(3);
    expect(pack.quiz.every((question) => question.options.length === 4)).toBe(true);
    expect(pack.quiz.every((question) => question.correct >= 0 && question.correct < 4)).toBe(true);
  });

  it("keeps the correct option pointing at the matching text", () => {
    const pack = buildMockPack(text, "ro", "lecture-02.pdf");
    for (const question of pack.quiz) {
      expect(question.options[question.correct]).toBeTruthy();
    }
  });
});

describe("prompts", () => {
  it("asks for the selected language and strict JSON", () => {
    expect(systemPrompt("ro")).toContain("Romanian");
    expect(systemPrompt("ru")).toContain("Russian");
    expect(systemPrompt("ro")).toContain("Return ONLY a valid JSON object");
  });
});
