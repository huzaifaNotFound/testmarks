import type { AttemptResult, Test } from "./types";

const KEY = "tma_last_result";

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
