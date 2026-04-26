You are building a full-stack educational Math Learning Platform using:

- Next.js (App Router)
- Node.js API routes (inside Next.js or separate service)
- MongoDB (Mongoose)
- JSX preferred
- Localization support via Accept-Language header (en, bn)
- No external AI solving initially (only template-based math system)

---

## 🧠 CORE IDEA

This app is a structured math learning system, not a general AI solver.

Users select predefined math problem templates and input values.
The system then:
1. Solves the problem using predefined logic (not AI)
2. Returns step-by-step explanation
3. Returns story-based explanation
4. Returns visualization data (graph, timeline, geometry, etc.)
5. Returns localized content (English or Bangla)

---

## 🌍 LOCALIZATION RULES

- Language is determined ONLY from request header:
  Accept-Language: en | bn

- MongoDB stores both languages:
  {
    title: { en: "...", bn: "..." },
    template: { en: "...", bn: "..." },
    inputs: [{ label: { en: "...", bn: "..." } }]
  }

- API response structure must ALWAYS be the same
- Only values change based on language

---

## 🗄️ DATABASE DESIGN (MongoDB)

Create a "problems" collection:

Each problem contains:
- id
- category (arithmetic | algebra | geometry | calculus | statistics)
- title (localized)
- template (localized with {variables})
- inputs (array with key, label, type)
- solverKey (maps to backend function)
- explanationKey
- storyKey
- visualKey

---

## ⚙️ BACKEND ARCHITECTURE

Create modular system:

/lib
  /solvers
  /explanations
  /stories
  /visuals
  /localization

### Rules:
- No solver logic in DB
- DB only stores keys
- Actual logic lives in backend functions

Example:
solverKey: "solveAge"
maps to:
function solveAge(inputs) {}

---

## 📡 API ENDPOINTS

### POST /api/solve

Request:
{
  problemId: string,
  inputs: object
}

Header:
Accept-Language: en | bn

Response:
{
  title: string,
  question: string,
  inputs: [],
  result: object,
  steps: string[],
  story: string,
  visual: object
}

---

## 🧠 SOLVER TYPES

Implement initial solvers:

1. Arithmetic
- percentage
- basic operations

2. Algebra
- linear equations
- age problems

3. Statistics
- mean, median

4. Geometry (basic)
- area, perimeter

---

## 🎨 VISUALIZATION SYSTEM

Return structured data:

- graph → Chart.js compatible data
- timeline → age problems
- geometry → shape coordinates

Frontend renders based on:
visual.type

---

## 🧾 FRONTEND (Next.js)

Pages:
- / (home)
- /problem/[id]
- /solve result page

Features:
- Dynamic form based on MongoDB inputs
- Solve button
- Result page shows:
  - Answer
  - Steps
  - Story
  - Visualization

---

## 🌍 LANGUAGE RULES

- Use next-intl ONLY for UI text (buttons, menus)
- Do NOT use next-intl for math content
- Math content comes from backend

---

## ⚠️ IMPORTANT RULES

- Keep API response structure consistent
- Never mix UI language logic with math logic
- Always fallback to English if translation missing
- Keep system scalable for adding new problem types

---

## 🎯 GOAL

Build a scalable, modular, localization-ready math learning platform for students (class 4–12), focusing on:

- Learning through visualization
- Step-by-step explanation
- Real-world story-based understanding
- Bangladesh + global education support