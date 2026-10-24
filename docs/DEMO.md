# 2-minute demo

## Before the call

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and keep a lecture PDF ready. If the network is unreliable, set `DEMO_MODE=true` in `.env.local`; the demo still works.

## Script

**0:00 — Problem.**  
"Students in Moldova get lecture PDFs in Romanian and Russian, but study tools work in one language and ignore the actual course. Lectura takes the lecture itself."

**0:15 — Show the demo pack.**  
Point at the title, the three tabs and the page chips.  
"The app starts with a real lecture on machine learning, so you can see the output shape before uploading anything."

**0:30 — Switch language.**  
Click `RU`. The same lecture, the same structure, Russian text.  
"Same document, same citations, different language."

**0:45 — Upload a PDF.**  
Drag a lecture PDF into the upload zone.  
"The server extracts text in memory, then builds the pack. No file storage, no account."

**1:10 — Flashcards.**  
Open the `Fișe` tab, flip two cards.  
"Active recall, not just a summary."

**1:25 — Quiz.**  
Answer one question wrong on purpose, show the explanation, then finish the quiz.  
"Every question has an explanation and a page reference."

**1:45 — Architecture.**  
Open the README diagram.  
"Next.js route handlers, a provider adapter for Meta Llama, Zod validation, deterministic fallback. One deploy, no separate backend."

**2:00 — Close.**  
"The skeleton is public. The next step is OCR and retrieval for long lectures."

## Backup plan

- If the PDF fails: use the built-in demo and say "this is the same contract the upload path returns".
- If the model is slow: the UI shows extraction and generation as separate states; the mock fallback keeps the demo moving.
- If the network is down: `DEMO_MODE=true` and use the demo pack.
