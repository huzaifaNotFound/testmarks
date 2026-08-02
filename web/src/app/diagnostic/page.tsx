"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import QuestionPlayer, { type PlayerAnswer } from "@/components/QuestionPlayer";
import { getDiagnostic, submitAttempt } from "@/lib/api";
import { RequireAuth, useAuth } from "@/lib/auth";
import { MOCK_TIME_LIMIT_SEC } from "@/lib/mock-data";
import { saveResult } from "@/lib/result-store";
import type { Test } from "@/lib/types";

function DiagnosticInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();
  const [test, setTest] = useState<Test | null>(null);

  const stream = params.get("stream") ?? user?.stream ?? "neet";

  useEffect(() => {
    let cancelled = false;
    getDiagnostic(stream).then((t) => {
      if (!cancelled) setTest(t);
    });
    return () => {
      cancelled = true;
    };
  }, [stream]);

  const handleSubmit = async (answers: PlayerAnswer[], timeTakenSec: number) => {
    if (!test) return;
    const result = await submitAttempt(
      {
        user_id: user?.id ?? "",
        test_id: test.test_id,
        answers,
        time_taken_sec: timeTakenSec,
      },
      test,
    );
    saveResult({
      result,
      test: { test_id: test.test_id, title: test.title, stream: test.stream },
      timeTakenSec,
      generated: false,
      at: new Date().toISOString(),
    });
    router.push("/report");
  };

  if (!test) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface dark:bg-[#0D0D10]">
        <Loader2 size={24} className="animate-spin text-crimson" />
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-ink dark:text-white">
            Composing diagnostic paper
          </p>
          <p className="text-[10px] text-black/40 dark:text-white/40 font-semibold tracking-wider uppercase">
            {stream} stream
          </p>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <QuestionPlayer test={test} timeLimitSec={MOCK_TIME_LIMIT_SEC} onSubmit={handleSubmit} />
    </RequireAuth>
  );
}

export default function DiagnosticPage() {
  return (
    <Suspense fallback={null}>
      <DiagnosticInner />
    </Suspense>
  );
}
