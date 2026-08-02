import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TXT = path.join(__dirname, "..", "texts");
const PARTIAL = path.join(__dirname, "partial");
const BANKS_OUT = path.join(__dirname, "..", "api", "app", "data", "banks");

const env = fs.readFileSync(path.join(__dirname, "..", "api", ".env"), "utf8");
const getEnv = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim() || "";
const API_KEY = getEnv("OPENCODE_API_KEY");
const BASE = getEnv("OPENCODE_BASE_URL") || "https://opencode.ai/zen/v1";
const MODEL = getEnv("GEN_MODEL") || getEnv("OPENCODE_MODEL") || "mimo-v2.5-free";

if (!API_KEY) {
  console.error("NO API KEY");
  process.exit(1);
}
fs.mkdirSync(PARTIAL, { recursive: true });
fs.mkdirSync(BANKS_OUT, { recursive: true });

const SYSTEM = `You write authentic NCERT-based multiple-choice questions for Indian students (CBSE / NEET / JEE).
Rules:
- Questions must be genuinely at the target level — NEVER trivial or baby questions.
- Use exact NCERT terminology and facts from the provided book text.
- Numericals where the chapter/subject naturally has them.
- Exactly 4 options, ONE correct, plausible distractors.
- explanation: 1-2 sentence real teaching explanation.
- difficulty: easy|medium|hard only.
- Return STRICT JSON ONLY (a single JSON object, no markdown, no prose, no code fences):
{"questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"...","difficulty":"medium","topic":"..."}]}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callLLM(userPrompt, maxTokens = 4096) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "User-Agent": "TestMarksAI/1.0",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: userPrompt },
          ],
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(180000),
      });
      if (res.status === 429) {
        await sleep(10000 * (attempt + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = await res.json();
      const msg = data.choices?.[0]?.message;
      const text = (msg?.content || msg?.reasoning || "").trim();
      if (!text) throw new Error("empty response");
      return text;
    } catch (e) {
      lastErr = e;
      await sleep(5000 * (attempt + 1));
    }
  }
  throw lastErr;
}

function extractJsonObjects(text) {
  const out = [];
  let depth = 0;
  let cur = "";
  let inStr = false;
  let esc = false;
  for (const ch of text) {
    if (inStr) {
      cur += ch;
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      cur += ch;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth > 0) cur += ch;
    if (depth === 0 && cur) {
      try {
        const obj = JSON.parse(cur);
        if (obj && typeof obj === "object") out.push(obj);
      } catch {
        /* keep scanning */
      }
      cur = "";
    }
  }
  return out;
}

function parseQuestions(text) {
  const objects = extractJsonObjects(text);
  const qs = [];
  for (const obj of objects) {
    const list = Array.isArray(obj) ? obj : obj.questions;
    if (Array.isArray(list)) {
      for (const q of list) {
        qs.push({
          question: String(q?.question ?? "").trim(),
          options: Array.isArray(q?.options) && q.options.length === 4 ? q.options.map(String) : null,
          correct: Number(q?.correct),
          explanation: String(q?.explanation ?? "").trim(),
          difficulty: ["easy", "medium", "hard"].includes(q?.difficulty) ? q.difficulty : "medium",
          topic: String(q?.topic ?? "General").trim(),
        });
      }
    }
  }
  return qs.filter((q) => q.question && q.options && q.options.every((o) => o) && q.explanation && q.correct >= 0 && q.correct <= 3);
}

function readText(rel) {
  const p = path.join(TXT, rel);
  if (!fs.existsSync(p)) return "";
  return fs.readFileSync(p, "utf8");
}

function clean(text) {
  return text
    .replace(/[Â\uFFFD]/g, "")
    .replace(/[^\x20-\x7E\n\u00B0\u2260\u2265\u2264\u2212\u00B2\u00B3\u2022\u2026]/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function sliceText(text, span, frac) {
  if (!text) return "";
  const start = Math.min(Math.max(0, Math.floor(text.length * frac)), Math.max(0, text.length - span));
  return text.slice(start, start + span);
}

function partFile(stream, key) {
  return path.join(PARTIAL, `${stream}__${key}.json`);
}

async function gen(stream, key, prompt) {
  const pfile = partFile(stream, key);
  if (fs.existsSync(pfile)) {
    console.log(`SKIP ${stream}/${key}`);
    return JSON.parse(fs.readFileSync(pfile, "utf8"));
  }
  try {
    const text = await callLLM(prompt);
    const qs = parseQuestions(text);
    if (qs.length === 0) throw new Error("no valid questions parsed");
    fs.writeFileSync(pfile, JSON.stringify(qs));
    console.log(`DONE ${stream}/${key} -> ${qs.length} qs`);
    return qs;
  } catch (e) {
    console.error(`FAIL ${stream}/${key}: ${e.message.slice(0, 140)}`);
    return null;
  }
}

async function runPool(jobs) {
  const results = new Map();
  const todo = jobs.filter((j) => {
    if (!j.prompt.includes("book text")) return true;
    if (j.prompt.length < 600) {
      console.log(`WAIT ${j.stream}/${j.key} (book text not ready yet)`);
      return false;
    }
    return true;
  });
  let idx = 0;
  async function worker() {
    while (idx < todo.length) {
      const j = todo[idx++];
      results.set(j.key, await gen(j.stream, j.key, j.prompt));
    }
  }
  const workers = Array.from({ length: 3 }, worker);
  await Promise.all(workers);
  return results;
}

function writeBank(stream, constName, questions) {
  const lines = questions.map((q) => {
    const opt = q.options.map((o) => JSON.stringify(o)).join(", ");
    return (
      `    {\n        "id": ${JSON.stringify(q.id)},\n        "subject": ${JSON.stringify(q.subject)},\n` +
      `        "topic": ${JSON.stringify(q.topic)},\n        "difficulty": ${JSON.stringify(q.difficulty)},\n` +
      `        "question": ${JSON.stringify(q.question)},\n        "options": [${opt}],\n        "correct": ${q.correct},\n` +
      `        "explanation": ${JSON.stringify(q.explanation)},\n    },`
    );
  });
  const content = `from typing import Any, Dict, List\n\n${constName}: List[Dict[str, Any]] = [\n${lines.join("\n")}\n]\n`;
  fs.writeFileSync(path.join(BANKS_OUT, `${stream}.py`), content, "utf8");
  console.log(`WROTE ${stream}.py (${questions.length} qs)`);
}

const C10_MATH = [
  ["jemh101", "Real Numbers"], ["jemh102", "Polynomials"], ["jemh103", "Pair of Linear Equations in Two Variables"],
  ["jemh104", "Quadratic Equations"], ["jemh105", "Arithmetic Progressions"], ["jemh106", "Triangles"],
  ["jemh107", "Coordinate Geometry"], ["jemh108", "Introduction to Trigonometry"], ["jemh109", "Some Applications of Trigonometry"],
  ["jemh110", "Circles"], ["jemh111", "Constructions"], ["jemh112", "Areas Related to Circles"],
  ["jemh113", "Surface Areas and Volumes"], ["jemh114", "Statistics"],
];
const C10_SCI = [
  ["jesc101", "Chemical Reactions and Equations"], ["jesc102", "Acids Bases and Salts"], ["jesc103", "Metals and Non-Metals"],
  ["jesc104", "Carbon and its Compounds"], ["jesc105", "Life Processes"], ["jesc106", "Control and Coordination"],
  ["jesc107", "How do Organisms Reproduce"], ["jesc108", "Heredity"], ["jesc109", "Light Reflection and Refraction"],
  ["jesc110", "The Human Eye and the Colourful World"], ["jesc111", "Electricity"], ["jesc112", "Magnetic Effects of Electric Current"],
  ["jesc113", "Our Environment"],
];

const SUBJ_FILES = {
  Physics: ["physics-p1", "physics-p2"],
  Chemistry: ["chemistry-p1", "chemistry-p2"],
  Mathematics: ["maths"],
  Biology: ["biology"],
};

function c10Jobs() {
  const jobs = [];
  for (const [file, title] of C10_MATH) {
    jobs.push({
      stream: "cbse-10", key: `math-${file.slice(4)}`, tag: `m${file.slice(4)}`, subject: "Mathematics",
      prompt: `CHAPTER: ${title}\nGenerate 6 questions for Class 10 Mathematics chapter "${title}" (4-5 easy, 1-2 medium). Use ONLY the book text.\n\n${clean(sliceText(readText(`c10/${file}.txt`), 14000, 0.12))}`,
    });
  }
  for (const [file, title] of C10_SCI) {
    jobs.push({
      stream: "cbse-10", key: `sci-${file.slice(4)}`, tag: `s${file.slice(4)}`, subject: "Science",
      prompt: `CHAPTER: ${title}\nGenerate 6 questions for Class 10 Science chapter "${title}" (4-5 easy, 1-2 medium). Use ONLY the book text.\n\n${clean(sliceText(readText(`c10/${file}.txt`), 14000, 0.12))}`,
    });
  }
  return jobs;
}

function classJobs(cls, stream, prefix) {
  const jobs = [];
  for (const subject of ["Physics", "Chemistry", "Mathematics", "Biology"]) {
    const tag = subject.slice(0, 2).toLowerCase();
    for (let i = 1; i <= 2; i++) {
      const files = SUBJ_FILES[subject].map((f) => readText(`c${cls}/${f}.txt`)).join("\n");
      const frac = i === 1 ? 0.08 : 0.55;
      jobs.push({
        stream, key: `${subject}-${i}`, tag, subject,
        prompt: `Generate 10 questions (roughly 4 easy, 5 medium, 1 hard) for Class ${cls} ${subject} (NCERT). Use ONLY the book text.\n\n${sliceText(clean(files), 12000, frac)}`,
      });
    }
  }
  return jobs;
}

function jeeMainsJobs() {
  const jobs = [];
  for (const subject of ["Physics", "Chemistry", "Mathematics"]) {
    const tag = subject.slice(0, 2).toLowerCase();
    const c11 = SUBJ_FILES[subject].map((f) => readText(`c11/${f}.txt`)).join("\n");
    const c12 = SUBJ_FILES[subject].map((f) => readText(`c12/${f}.txt`)).join("\n");
    jobs.push({
      stream: "jee_mains", key: `${subject}-11`, tag, subject,
      prompt: `Generate 4 questions (1 easy, 2 medium, 1 hard) from CLASS 11 ${subject} — this is the 25% class-11 portion of a JEE Main paper. Use ONLY the text.\n\n${sliceText(clean(c11), 12000, 0.2)}`,
    });
    jobs.push({
      stream: "jee_mains", key: `${subject}-12`, tag, subject,
      prompt: `Generate 12 questions (2 easy, 7 medium, 3 hard) from CLASS 12 ${subject} — this is the 75% class-12 portion of a JEE Main paper (class 12 dominates JEE Main). Use ONLY the text.\n\n${sliceText(clean(c12), 14000, 0.25)}`,
    });
  }
  return jobs;
}

function jeeAdvancedJobs() {
  const jobs = [];
  for (const subject of ["Physics", "Chemistry", "Mathematics"]) {
    const tag = subject.slice(0, 2).toLowerCase();
    const c11 = SUBJ_FILES[subject].map((f) => readText(`c11/${f}.txt`)).join("\n");
    const c12 = SUBJ_FILES[subject].map((f) => readText(`c12/${f}.txt`)).join("\n");
    jobs.push({
      stream: "jee_advanced", key: subject, tag, subject,
      prompt: `Generate 10 questions at JEE ADVANCED level (4 medium, 6 hard) for ${subject} from BOTH Class 11 and Class 12 NCERT — multi-concept, application-heavy, tricky. Use ONLY the texts.\n\nCLASS 11:\n${sliceText(clean(c11), 9000, 0.3)}\n\nCLASS 12:\n${sliceText(clean(c12), 9000, 0.3)}`,
    });
  }
  return jobs;
}

function neetJobs() {
  const jobs = [];
  for (const subject of ["Physics", "Chemistry", "Biology"]) {
    const tag = subject.slice(0, 2).toLowerCase();
    const c11 = SUBJ_FILES[subject].map((f) => readText(`c11/${f}.txt`)).join("\n");
    const c12 = SUBJ_FILES[subject].map((f) => readText(`c12/${f}.txt`)).join("\n");
    jobs.push({
      stream: "neet", key: `${subject}-11`, tag, subject,
      prompt: `Generate 8 questions (4 easy, 4 medium, strongly NCERT-based) from CLASS 11 ${subject} for NEET. Use ONLY the text.\n\n${sliceText(clean(c11), 12000, 0.25)}`,
    });
    jobs.push({
      stream: "neet", key: `${subject}-12`, tag, subject,
      prompt: `Generate 8 questions (4 easy, 4 medium, strongly NCERT-based) from CLASS 12 ${subject} for NEET. Use ONLY the text.\n\n${sliceText(clean(c12), 12000, 0.25)}`,
    });
  }
  return jobs;
}

async function main() {
  const only = process.argv[2];
  const registry = [
    { stream: "cbse-10", constName: "CBSE_10_BANK", prefix: "c10", jobs: c10Jobs() },
    { stream: "cbse-11", constName: "CBSE_11_BANK", prefix: "cb11", jobs: classJobs(11, "cbse-11", "cb11") },
    { stream: "cbse-12", constName: "CBSE_12_BANK", prefix: "cb12", jobs: classJobs(12, "cbse-12", "cb12") },
    { stream: "jee_mains", constName: "JEE_MAINS_BANK", prefix: "jm", jobs: jeeMainsJobs() },
    { stream: "jee_advanced", constName: "JEE_ADVANCED_BANK", prefix: "ja", jobs: jeeAdvancedJobs() },
    { stream: "neet", constName: "NEET_BANK", prefix: "neet", jobs: neetJobs() },
  ];

  const targets = only ? registry.filter((r) => r.stream === only) : registry;
  for (const r of targets) {
    if (r.jobs.length === 0) continue;
    console.log(`\n=== ${r.stream} (${r.jobs.length} calls) ===`);
    const results = await runPool(r.jobs);
    const all = [];
    for (const j of r.jobs) {
      const qs = results.get(j.key);
      if (qs) {
        for (const q of qs) all.push({ ...q, id: `${r.prefix}-${j.tag}-${String(all.length + 1).padStart(2, "0")}`, subject: j.subject });
      }
    }
    if (all.length > 0) writeBank(r.stream, r.constName, all);
    console.log(`${r.stream} total: ${all.length} qs`);
  }
  console.log("\nALL DONE");
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
