# Architecture

## Goal

A 10-day hackathon skeleton that turns a lecture PDF into a bilingual study pack without standing up a separate backend. The important part is the **contract**: the UI, the PDF extractor and the model provider all agree on one `StudyPack` shape.

## Request flow

```text
Browser
  │  POST /api/extract  (multipart: file, lang)
  ▼
Route handler (Node runtime)
  │  unpdf.getDocumentProxy -> extractText({ mergePages: true })
  │  guard: 15 MB, PDF only, at least 40 visible characters
  ▼
{ document: { id, name, pages, chars, language, text } }
  │
  │  POST /api/study  (JSON: text, lang, title)
  ▼
generateStudyPack()
  ├─ META_API_KEY + DEMO_MODE != true
  │    └─ Meta Llama API /chat/completions
  │         └─ JSON.parse -> Zod safeParse
  └─ otherwise / on any provider error
       └─ buildMockPack() (deterministic heuristics)
  ▼
{ pack: StudyPack, provider: "meta" | "mock" }
```

The client keeps the extracted text in memory and sends it again when the language changes. There is no document store.

## Why two endpoints

`/api/extract` and `/api/study` fail for different reasons and have different costs. Separating them makes it possible to:

- retry generation without re-uploading the PDF;
- switch RO/RU without re-parsing the PDF;
- test the provider adapter without a PDF;
- swap in an OCR service later without touching the study endpoint.

If the product grows, the same contract can move to a queue: `extract` returns a document id, `study` runs asynchronously.

## Provider adapter

`lib/ai/provider.ts` is the only place that knows about Meta. It:

1. picks mock mode when there is no key or `DEMO_MODE=true`;
2. calls an OpenAI-compatible `chat/completions` endpoint;
3. strips accidental markdown fences;
4. validates the result with Zod;
5. falls back to the mock on any error.

The model name and base URL are environment variables, so the same adapter works with a local Llama server or a hosted endpoint.

## Prompt strategy

The system prompt asks for:

- the selected language (Romanian or Russian);
- strict JSON, no commentary;
- 3–6 key points, 4–6 flashcards, 3–5 quiz questions, 2–6 terms;
- no invented facts;
- page numbers only when they can be inferred.

The user prompt wraps the lecture text in `<<< >>>` delimiters and caps it at `MAX_INPUT_CHARS` (24k by default). This is deliberate: a demo should not send an entire 200-page PDF to a model.

## Mock provider

`buildMockPack()` is not an AI. It is a deterministic fallback that:

- returns the hand-written demo pack when the text looks like the demo lecture;
- otherwise splits the text into sentences and builds key points, cards and quiz distractors from them.

This keeps the UI demoable offline and makes tests stable. It is clearly labelled in the UI as `Demo provider`.

## UI state

`components/workspace.tsx` owns:

- `lang` — RO/RU;
- `doc` — current document metadata + text;
- `pack` — current study pack;
- `provider` — `meta` or `mock`;
- `busy` — `idle | extract | study`;
- `tab` — `summary | flashcards | quiz`.

A request counter (`requestId`) ignores stale responses when the user switches language quickly.

## Design system

The visual language is "paper and ink": warm paper background, a serif display face (Literata), a compact sans (Manrope), deep green for action, terracotta for accents, thin rules and flat cards. No gradients on content, no glassmorphism, no stock-photo hero.

The layout is a two-column workspace: a narrow rail for the library/document, a wide study pack. It collapses to one column under 980 px.

## Production gaps

- **OCR:** scanned PDFs return a clear 422; add Tesseract or a hosted OCR.
- **Long documents:** add chunking + retrieval instead of truncating at 24k chars.
- **Rate limits:** add a token bucket per IP and a max request size at the proxy.
- **Observability:** log request ids, latency and provider fallback rate; never log document text.
- **Evaluation:** a small golden set of lecture PDFs with expected key points, scored by an LLM judge + human review.
