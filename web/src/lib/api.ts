import {
  buildMockTest,
  computeMockResult,
  mockAnalytics,
  mockPlan,
  MOCK_QUESTION_COUNT,
  MOCK_STREAMS,
} from "./mock-data";
import type {
  Analytics,
  AttemptResult,
  GenerateTestPayload,
  PlanRecommendation,
  Stream,
  SubmitAttemptPayload,
  Test,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 1500;

async function tryFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function hasCompletedTest(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("tma_test_completed") === "1";
}

export async function getHealth(): Promise<{ status: string }> {
  const data = await tryFetch<{ status: string }>("/health");
  return data ?? { status: "mock" };
}

export async function getStreams(): Promise<Stream[]> {
  const data = await tryFetch<Stream[]>("/api/streams");
  return data ?? MOCK_STREAMS;
}

export async function getDiagnostic(streamId: string): Promise<Test> {
  const data = await tryFetch<Test>(`/api/diagnostic/${encodeURIComponent(streamId)}`);
  return data ?? buildMockTest(streamId, MOCK_QUESTION_COUNT, "Diagnostic Test");
}

export async function submitAttempt(payload: SubmitAttemptPayload, test: Test): Promise<AttemptResult> {
  const data = await tryFetch<AttemptResult>("/api/attempts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data) return data;
  return computeMockResult(test, payload.answers);
}

export async function generateTest(payload: GenerateTestPayload): Promise<Test> {
  const data = await tryFetch<Test>("/api/tests/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return (
    data ??
    buildMockTest(
      payload.stream,
      payload.count,
      `AI Mock ${payload.difficulty ? `(${payload.difficulty})` : ""}`,
    )
  );
}

export async function getAnalytics(userId: string, streamId = "neet"): Promise<Analytics> {
  // Dynamically import to avoid circular deps at module load time
  const { buildLocalAnalytics } = await import("./result-store");

  const userCompletedTest = hasCompletedTest();

  // Try real backend first
  const data = await tryFetch<Analytics>(`/api/analytics/${encodeURIComponent(userId)}`);

  if (data) {
    // Backend responded — use real data if there are real attempts,
    // otherwise fall back to example data for brand-new accounts.
    if (data.attempts > 0 || userCompletedTest) {
      return data;
    }
    // New account with 0 backend attempts: show example data
    return mockAnalytics(streamId);
  }

  // Backend offline: use local history if a test was completed, else show example data
  if (userCompletedTest) {
    return buildLocalAnalytics(streamId);
  }

  return mockAnalytics(streamId);
}

export async function getPlan(userId: string, testId?: string): Promise<PlanRecommendation[]> {
  const data = await tryFetch<{ recommendations: PlanRecommendation[] }>("/api/plan", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, test_id: testId }),
  });
  if (data?.recommendations) return data.recommendations;
  const result: AttemptResult = {
    score: 0,
    total: 50,
    accuracy: 0,
    per_topic: [],
    weak_areas: [
      { topic: "Electrostatics", accuracy: 0.4 },
      { topic: "Chemical Bonding", accuracy: 0.45 },
      { topic: "Human Physiology", accuracy: 0.5 },
    ],
    strong_areas: [],
    percentile_est: 0,
    coach_message: "",
  };
  return mockPlan(result);
}
