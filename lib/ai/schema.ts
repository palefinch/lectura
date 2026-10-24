import { z } from "zod";

export const studyPackSchema = z.object({
  title: z.string().min(2).max(160),
  summary: z.string().min(40).max(1200),
  keyPoints: z
    .array(
      z.object({
        text: z.string().min(10).max(400),
        page: z.number().int().positive().optional(),
      }),
    )
    .min(3)
    .max(8),
  flashcards: z
    .array(
      z.object({
        question: z.string().min(8).max(300),
        answer: z.string().min(4).max(500),
        page: z.number().int().positive().optional(),
      }),
    )
    .min(3)
    .max(10),
  quiz: z
    .array(
      z.object({
        question: z.string().min(8).max(300),
        options: z.array(z.string().min(1).max(200)).length(4),
        correct: z.number().int().min(0).max(3),
        explanation: z.string().min(10).max(500),
        page: z.number().int().positive().optional(),
      }),
    )
    .min(2)
    .max(8),
  terms: z
    .array(
      z.object({
        term: z.string().min(2).max(80),
        definition: z.string().min(8).max(300),
      }),
    )
    .max(10),
});

export type StudyPackInput = z.infer<typeof studyPackSchema>;
