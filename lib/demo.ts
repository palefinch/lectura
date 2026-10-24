import type { DocumentMeta, Lang, StudyPack } from "./types";

const roPack: StudyPack = {
  title: "Introducere în învățarea automată",
  summary:
    "Lecția introduce învățarea automată ca o modalitate de a extrage reguli din date, nu de a scrie reguli de mână. Sunt comparate învățarea supravegheată și cea nesupravegheată, se explică rolul setului de validare și se arată de ce calitatea datelor limitează calitatea modelului.",
  keyPoints: [
    {
      text: "Învățarea supravegheată pornește de la perechi intrare–etichetă; modelul învață o funcție care generalizează pe date noi.",
      page: 3,
    },
    {
      text: "Învățarea nesupravegheată caută structură în date fără etichete: grupuri, factori latenți, anomalii.",
      page: 5,
    },
    {
      text: "Setul de validare este separat de setul de antrenament; altfel nu putem detecta supraînvățarea.",
      page: 7,
    },
    {
      text: "O funcție de pierdere simplă, antrenată pe date curate, bate un model complex antrenat pe date murdare.",
      page: 9,
    },
    {
      text: "Metrica se alege după costul erorii: acuratețea singură poate ascunde dezechilibre grave.",
      page: 11,
    },
  ],
  terms: [
    {
      term: "Supraînvățare",
      definition:
        "Modelul memorează zgomotul din setul de antrenament și pierde capacitatea de generalizare.",
    },
    {
      term: "Validare încrucișată",
      definition:
        "Împărțirea repetată a datelor în pliuri, pentru o estimare mai stabilă a performanței.",
    },
    {
      term: "Funcție de pierdere",
      definition:
        "Măsoară cât de departe este predicția de valoarea așteptată; antrenarea o minimizează.",
    },
    {
      term: "Generalizare",
      definition:
        "Performanța pe date nevăzute, nu pe cele folosite la antrenament.",
    },
  ],
  flashcards: [
    {
      question:
        "Care este diferența dintre învățarea supravegheată și cea nesupravegheată?",
      answer:
        "Supravegheată: perechi intrare–etichetă. Nesupravegheată: doar intrări, se caută structură.",
      page: 3,
    },
    {
      question: "De ce avem nevoie de un set de validare?",
      answer:
        "Pentru a estima performanța pe date noi și a detecta supraînvățarea.",
      page: 7,
    },
    {
      question: "Ce înseamnă supraînvățare?",
      answer:
        "Modelul se potrivește prea bine pe antrenament, dar generalizează slab.",
      page: 8,
    },
    {
      question: "Când acuratețea este o metrică periculoasă?",
      answer:
        "Când clasele sunt dezechibrate; clasa majoritară poate domina scorul.",
      page: 11,
    },
    {
      question: "Ce face o funcție de pierdere?",
      answer:
        "Cuantifică eroarea predicției; antrenarea o minimizează.",
      page: 9,
    },
  ],
  quiz: [
    {
      question:
        "Un model are 98% acuratețe pe un set cu 2% cazuri pozitive. Ce verifici mai întâi?",
      options: [
        "Matricea de confuzie și recall-ul clasei pozitive",
        "Doar acuratețea, este suficientă",
        "Numărul de parametri ai modelului",
        "Timpul de antrenament",
      ],
      correct: 0,
      explanation:
        "Cu clase dezechibrate, acuratețea mare poate veni doar din predicția clasei majoritare. Recall-ul și matricea de confuzie arată ce se întâmplă cu cazurile pozitive.",
      page: 11,
    },
    {
      question: "Care set este folosit pentru a detecta supraînvățarea?",
      options: [
        "Setul de validare",
        "Setul de antrenament",
        "Doar setul de test final",
        "Toate seturile sunt identice",
      ],
      correct: 0,
      explanation:
        "Setul de validare rămâne separat de antrenament și aproximează performanța pe date noi.",
      page: 7,
    },
    {
      question: "Învățarea nesupravegheată…",
      options: [
        "nu folosește etichete",
        "folosește doar etichete",
        "nu are nevoie de date",
        "este mereu mai bună decât cea supravegheată",
      ],
      correct: 0,
      explanation:
        "Modelul primește doar intrări și caută structură: grupuri, factori latenți sau anomalii.",
      page: 5,
    },
    {
      question: "De ce datele murdare sunt periculoase?",
      options: [
        "Modelul învață zgomotul și îl propagă în predicții",
        "Cresc doar timpii de antrenament",
        "Nu afectează deloc modelul",
        "Ajută la generalizare",
      ],
      correct: 0,
      explanation:
        "Zgomotul din date devine parte din regulile învățate. Un model simplu pe date curate bate un model complex pe date murdare.",
      page: 9,
    },
  ],
};

const ruPack: StudyPack = {
  title: "Введение в машинное обучение",
  summary:
    "Лекция объясняет машинное обучение как способ извлекать правила из данных, а не писать их вручную. Сравниваются обучение с учителем и без учителя, разбирается роль валидационной выборки и показывается, почему качество данных ограничивает качество модели.",
  keyPoints: [
    {
      text: "Обучение с учителем начинается с пар «вход — метка»; модель учится функции, которая обобщает на новые данные.",
      page: 3,
    },
    {
      text: "Обучение без учителя ищет структуру в данных без меток: кластеры, скрытые факторы, аномалии.",
      page: 5,
    },
    {
      text: "Валидационная выборка отделена от обучающей; иначе переобучение не заметить.",
      page: 7,
    },
    {
      text: "Простая функция потерь на чистых данных бьёт сложную модель на грязных данных.",
      page: 9,
    },
    {
      text: "Метрику выбирают по цене ошибки: одна точность может скрыть сильный дисбаланс классов.",
      page: 11,
    },
  ],
  terms: [
    {
      term: "Переобучение",
      definition:
        "Модель запоминает шум обучающей выборки и теряет способность обобщать.",
    },
    {
      term: "Кросс-валидация",
      definition:
        "Многократное разбиение данных на фолды для более устойчивой оценки качества.",
    },
    {
      term: "Функция потерь",
      definition:
        "Измеряет, насколько предсказание далеко от ожидаемого значения; обучение её минимизирует.",
    },
    {
      term: "Обобщение",
      definition:
        "Качество на новых данных, а не на тех, что использовались при обучении.",
    },
  ],
  flashcards: [
    {
      question:
        "Чем обучение с учителем отличается от обучения без учителя?",
      answer:
        "С учителем: пары «вход — метка». Без учителя: только входы, модель ищет структуру.",
      page: 3,
    },
    {
      question: "Зачем нужна валидационная выборка?",
      answer:
        "Чтобы оценить качество на новых данных и заметить переобучение.",
      page: 7,
    },
    {
      question: "Что такое переобучение?",
      answer:
        "Модель слишком хорошо подстраивается под обучающую выборку, но плохо обобщает.",
      page: 8,
    },
    {
      question: "Когда точность — опасная метрика?",
      answer:
        "При сильном дисбалансе классов: мажоритарный класс может дать высокий score.",
      page: 11,
    },
    {
      question: "Что делает функция потерь?",
      answer:
        "Количественно измеряет ошибку предсказания; обучение её минимизирует.",
      page: 9,
    },
  ],
  quiz: [
    {
      question:
        "Модель показывает 98% точности на выборке, где положительных примеров всего 2%. Что проверить первым?",
      options: [
        "Матрицу ошибок и recall положительного класса",
        "Только точность, этого достаточно",
        "Количество параметров модели",
        "Время обучения",
      ],
      correct: 0,
      explanation:
        "При дисбалансе высокая точность может быть просто предсказанием мажоритарного класса. Recall и матрица ошибок показывают, что происходит с положительными примерами.",
      page: 11,
    },
    {
      question: "Какая выборка используется, чтобы заметить переобучение?",
      options: [
        "Валидационная",
        "Обучающая",
        "Только финальная тестовая",
        "Все выборки одинаковы",
      ],
      correct: 0,
      explanation:
        "Валидационная выборка остаётся отдельной от обучающей и приближает качество на новых данных.",
      page: 7,
    },
    {
      question: "Обучение без учителя…",
      options: [
        "не использует метки",
        "использует только метки",
        "не требует данных",
        "всегда лучше обучения с учителем",
      ],
      correct: 0,
      explanation:
        "Модель получает только входы и ищет структуру: кластеры, скрытые факторы или аномалии.",
      page: 5,
    },
    {
      question: "Почему грязные данные опасны?",
      options: [
        "Модель выучивает шум и переносит его в предсказания",
        "Растёт только время обучения",
        "Они вообще не влияют на модель",
        "Они помогают обобщению",
      ],
      correct: 0,
      explanation:
        "Шум становится частью выученных правил. Простая модель на чистых данных бьёт сложную на грязных.",
      page: 9,
    },
  ],
};

export function demoPack(lang: Lang): StudyPack {
  return lang === "ro" ? roPack : ruPack;
}

export function demoDocument(lang: Lang): DocumentMeta {
  return {
    id: "demo-lecture",
    name:
      lang === "ro"
        ? "curs-01-introducere-in-ml.pdf"
        : "лекция-01-введение-в-ml.pdf",
    pages: 12,
    chars: lang === "ro" ? 18420 : 19210,
    language: lang,
    text: demoText(lang),
  };
}

export function demoText(lang: Lang): string {
  const pack = demoPack(lang);
  return [
    pack.title,
    pack.summary,
    ...pack.keyPoints.map((point) => point.text),
    ...pack.terms.map((term) => `${term.term}: ${term.definition}`),
  ].join("\n\n");
}
