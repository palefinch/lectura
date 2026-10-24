# Roadmap

## 10-day hackathon plan

| Day | Goal | Definition of done |
|---|---|---|
| 1 | Skeleton + demo pack | `npm run dev` renders the workspace; CI green |
| 2 | Real PDF extraction | 5 lecture PDFs from USM/Tekwill parse without errors |
| 3 | Meta Llama adapter | One real request returns a valid `StudyPack`; fallback logged |
| 4 | Prompt evaluation | 10 lectures, 3 raters, rubric for faithfulness/citations |
| 5 | Long documents | Chunking + retrieval; no silent truncation |
| 6 | OCR | Scanned PDF path with Tesseract or hosted OCR |
| 7 | Study loop | Spaced repetition state, "known / review" per card |
| 8 | Polish | Mobile pass, empty/error states, keyboard and screen-reader audit |
| 9 | Demo video | 2-minute recording, README GIF, submission form |
| 10 | Buffer | Fix only; no new features |

## Production backlog

1. **Auth + library** — save packs, sync between devices.
2. **LMS integration** — Moodle / Google Classroom import.
3. **Teacher mode** — generate a quiz bank from a course folder.
4. **Evaluation harness** — golden lectures, citation accuracy, hallucination checks.
5. **Cost controls** — per-user token budget, caching of identical documents.
6. **Privacy** — retention policy, data processing agreement, delete-on-request.
7. **Accessibility** — WCAG AA audit, keyboard-only flow, screen-reader labels.
8. **Internationalization** — RO/RU interface is in place; add EN for exchange students.

## What not to build yet

- a mobile app;
- a custom vector database;
- a fine-tuned model;
- real-time collaboration.

The hackathon win condition is a clear demo of one loop: **PDF → trustworthy study pack → active recall**, in two languages.
