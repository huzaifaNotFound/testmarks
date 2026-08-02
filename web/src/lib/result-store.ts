import type { AttemptResult, Test, Analytics } from "./types";
import { mockAnalytics, MOCK_STREAMS } from "./mock-data";

const KEY = "tma_last_result";
const HISTORY_KEY = "tma_attempts_history";

export interface StoredResult {
  result: AttemptResult;
  test: Pick<Test, "test_id" | "title" | "stream">;
  timeTakenSec: number;
  generated: boolean;
  at: string;
}

export function saveResult(data: StoredResult) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));

  try {
    const rawHistory = window.localStorage.getItem(HISTORY_KEY);
    const history = rawHistory ? JSON.parse(rawHistory) : [];

    history.push({
      id: `att-${Math.random().toString(36).substring(2, 10)}`,
      test_id: data.test.test_id,
      title: data.test.title,
      stream: data.test.stream,
      date: data.at.slice(0, 10),
      score: data.result.score,
      total: data.result.total,
      accuracy: data.result.accuracy,
      per_topic: data.result.per_topic,
    });

    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    window.localStorage.setItem("tma_test_completed", "1");
  } catch (e) {
    console.error("Error saving result to history", e);
  }
}

export function readResult(): StoredResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredResult) : null;
  } catch {
    return null;
  }
}

export function getLocalHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearLocalHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem("tma_test_completed");
}

export function buildLocalAnalytics(streamId: string): Analytics {
  const history = getLocalHistory();
  if (history.length === 0) {
    return mockAnalytics(streamId);
  }

  const attemptsCount = history.length;
  const avgScore = Math.round(history.reduce((acc: number, a: any) => acc + (a.accuracy * (a.accuracy <= 1 ? 100 : 1)), 0) / attemptsCount);
  const trend = history.map((a: any) => ({
    date: a.date,
    score: Math.round(a.accuracy * (a.accuracy <= 1 ? 100 : 1))
  })).slice(-10);

  // Heatmap
  const heatmap: Record<string, Record<string, number[]>> = {};
  history.forEach((a: any) => {
    if (a.per_topic) {
      a.per_topic.forEach((t: any) => {
        heatmap[t.subject] = heatmap[t.subject] || {};
        heatmap[t.subject][t.topic] = heatmap[t.subject][t.topic] || [];
        // normalize accuracy input
        const acc = t.accuracy > 1 ? t.accuracy / 100 : t.accuracy;
        heatmap[t.subject][t.topic].push(acc);
      });
    }
  });

  // Average the accuracy values in heatmap
  const heatMapAvg: Record<string, Record<string, number>> = {};
  Object.entries(heatmap).forEach(([subject, topics]) => {
    heatMapAvg[subject] = {};
    Object.entries(topics).forEach(([topic, accs]: any) => {
      heatMapAvg[subject][topic] = Math.round((accs.reduce((sum: number, v: number) => sum + v, 0) / accs.length) * 100) / 100;
    });
  });

  const brain_map = Object.entries(heatMapAvg).map(([subject, topics]) => {
    const vals = Object.values(topics);
    const avg = vals.reduce((sum: number, v: number) => sum + v, 0) / vals.length;
    return { subject, value: avg };
  }).sort((a, b) => b.value - a.value);

  const stream = MOCK_STREAMS.find(s => s.id === streamId) ?? MOCK_STREAMS[0];
  const maxMarks = streamId.startsWith("cbse") ? 80 : streamId === "neet" ? 720 : streamId === "jee-mains" ? 300 : 360;
  
  const recentSlice = history.slice(-5);
  const mean_acc = recentSlice.reduce((acc: number, a: any) => acc + (a.accuracy > 1 ? a.accuracy / 100 : a.accuracy), 0) / recentSlice.length;
  const expected = Math.round(mean_acc * maxMarks);

  const xp = history.reduce((sum: number, a: any) => sum + (a.score * 10), 0);
  const level = Math.floor(xp / 300) + 1;

  const recent_attempts = history.map((a: any) => ({
    id: a.id,
    title: a.title || `${stream.name} Attempt`,
    stream: a.stream,
    score: a.score,
    total: a.total,
    accuracy: a.accuracy > 1 ? a.accuracy / 100 : a.accuracy,
    date: a.date
  })).reverse().slice(0, 5);

  const badges = [
    { id: "first", name: "First Blood", description: "Attempted your first mock test", icon: "Zap", earned: history.length >= 1 },
    { id: "streak3", name: "On Fire", description: "3-day practice streak", icon: "Flame", earned: history.length >= 3 },
    { id: "streak7", name: "Unstoppable", description: "7-day practice streak", icon: "Flame", earned: false },
    { id: "top10", name: "Top 10%", description: "Scored in the top 10th percentile", icon: "Trophy", earned: history.some((a: any) => (a.accuracy > 1 ? a.accuracy / 100 : a.accuracy) >= 0.8) },
    { id: "accuracy90", name: "Sharpshooter", description: "90%+ accuracy in a test", icon: "Target", earned: history.some((a: any) => (a.accuracy > 1 ? a.accuracy / 100 : a.accuracy) >= 0.9) },
    { id: "quiz5", name: "Deep Thinker", description: "5 tests with 70%+ accuracy", icon: "Brain", earned: history.filter((a: any) => (a.accuracy > 1 ? a.accuracy / 100 : a.accuracy) >= 0.7).length >= 5 },
    { id: "level5", name: "Rising Star", description: "Reached level 5", icon: "Rocket", earned: level >= 5 },
    { id: "perfect", name: "Perfect 10", description: "Full marks in a section", icon: "Crown", earned: false },
    { id: "consistent", name: "Consistent", description: "Improving trend across 6 tests", icon: "Star", earned: history.length >= 6 },
  ];

  return {
    attempts: attemptsCount,
    avg_score: avgScore,
    trend,
    heatmap: heatMapAvg,
    brain_map,
    predictor: { expected, max: maxMarks },
    streak: Math.min(history.length, 5),
    xp,
    level,
    badges,
    recent_attempts
  };
}
