import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, "..", "api", ".env"), "utf8");
const getEnv = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim() || "";
const API_KEY = getEnv("OPENCODE_API_KEY");
const BASE = getEnv("OPENCODE_BASE_URL") || "https://opencode.ai/zen/v1";
const MODEL = process.argv[2] || "deepseek-v4-flash-free";

const text = fs.readFileSync(path.join(__dirname, "..", "texts", "c10", "jemh101.txt"), "utf8").slice(0, 3000);

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
      { role: "system", content: "Return STRICT JSON only: {\"questions\":[{\"question\":\"...\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correct\":0,\"explanation\":\"...\",\"difficulty\":\"easy\",\"topic\":\"...\"}]}" },
      { role: "user", content: `Generate 2 questions from this text:\n\n${text}` },
    ],
    max_tokens: 2000,
  }),
  signal: AbortSignal.timeout(180000),
});

const data = await res.json();
const msg = data.choices?.[0]?.message;
console.log("MODEL:", MODEL, "| finish:", data.choices?.[0]?.finish_reason, "| cost:", data.cost);
console.log("content len:", (msg?.content || "").length, "| reasoning len:", (msg?.reasoning || "").length);
console.log("---content---");
console.log((msg?.content || msg?.reasoning || "EMPTY").slice(0, 1200));
