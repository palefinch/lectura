export type Lang = "ro" | "ru";

export type DocumentMeta = {
  id: string;
  name: string;
  pages: number;
  chars: number;
  language: Lang;
  text?: string;
};

export type KeyPoint = {
  text: string;
  page?: number;
};

export type Flashcard = {
  question: string;
  answer: string;
  page?: number;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  page?: number;
};

export type Term = {
  term: string;
  definition: string;
};

export type StudyPack = {
  title: string;
  summary: string;
  keyPoints: KeyPoint[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  terms: Term[];
};

export type StudyRequest = {
  text: string;
  lang: Lang;
  title?: string;
};

export type ExtractResponse = {
  document: DocumentMeta;
};

export type StudyResponse = {
  pack: StudyPack;
  provider: "meta" | "mock";
};

export type ApiError = {
  error: string;
};
