"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { QuestionPaperView } from "@vedaai/ui";
import { GenerationStatusSubscriber } from "./generation-status-subscriber";
import { useAssignmentStatus } from "@/lib/stores/generation-status-store";
import { fetchAssignmentOutput } from "@/lib/api/output";
import type { QuestionPaper } from "@vedaai/types";

interface Props {
  assignmentId: string;
  initialPaper?: QuestionPaper | null;
  initialStatus?: string;
}

function Spinner() {
  return (
    <div className="relative mx-auto h-16 w-16">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#f0f0f0] border-t-[#ff5623]" />
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
      <div
        className="h-full rounded-full bg-[#ff5623] transition-[width] duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  idle: "Queued",
  queued: "Queued",
  processing: "Generating…",
  generating_section_A: "Generating Section A…",
  generating_section_B: "Generating Section B…",
  completed: "Done",
  failed: "Failed",
};

export function OutputClient({
  assignmentId,
  initialPaper = null,
  initialStatus,
}: Props) {
  const { status: socketStatus, message, progress } = useAssignmentStatus(assignmentId);
  const [paper, setPaper] = useState<QuestionPaper | null>(initialPaper);
  const [resolvedStatus, setResolvedStatus] = useState<string | null>(initialStatus ?? null);
  const [isPending, startTransition] = useTransition();

  const loadingRef = useRef(false);
  const loadedRef = useRef(!!initialPaper);

  const displayStatus = resolvedStatus ?? socketStatus;

  const loadOutput = useCallback(() => {
    if (loadingRef.current || loadedRef.current) return;

    loadingRef.current = true;
    startTransition(async () => {
      try {
        const result = await fetchAssignmentOutput(assignmentId);
        setResolvedStatus(result.status);
        if (result.output) {
          setPaper(result.output);
          loadedRef.current = true;
        }
      } finally {
        loadingRef.current = false;
      }
    });
  }, [assignmentId]);

  // Keep a stable ref to loadOutput so the polling interval never needs
  // to be re-created when loadOutput's identity changes.
  const loadOutputRef = useRef(loadOutput);
  useEffect(() => { loadOutputRef.current = loadOutput; }, [loadOutput]);

  // One-shot check on mount when SSR did not provide the paper
  useEffect(() => {
    if (initialPaper) return;
    loadOutput();
  }, [initialPaper, loadOutput]);

  // Socket signaled completion — fetch paper once
  useEffect(() => {
    if (socketStatus !== "completed" || paper !== null) return;
    loadOutput();
  }, [socketStatus, paper, loadOutput]);

  // Polling fallback — in case Socket.IO fails (CORS, network, etc.)
  // Empty deps = interval starts ONCE on mount, never restarts.
  // Uses loadOutputRef so it always calls the latest loadOutput.
  useEffect(() => {
    if (loadedRef.current) return; // SSR already had the paper

    const interval = setInterval(() => {
      if (loadedRef.current) {
        clearInterval(interval);
        return;
      }
      loadOutputRef.current();
    }, 3000);

    return () => clearInterval(interval);
  }, []); // ← intentionally empty: only one interval, ever

  const needsSocket =
    !initialPaper &&
    displayStatus !== "completed" &&
    displayStatus !== "failed";

  return (
    <>
      {needsSocket ? <GenerationStatusSubscriber assignmentId={assignmentId} /> : null}

      {paper ? (
        <div className="mx-auto max-w-[1100px] rounded-[32px] bg-[#5e5e5e] p-2 sm:p-4 lg:p-5 print:bg-white print:p-0 print:rounded-none">
          <QuestionPaperView paper={paper} />
        </div>
      ) : null}

      {!paper && isPending ? (
        <div className="mx-auto max-w-[1100px] animate-pulse space-y-4 rounded-3xl bg-white p-8">
          <div className="h-6 w-2/3 rounded bg-[#f0f0f0]" />
          <div className="h-4 w-1/2 rounded bg-[#f0f0f0]" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-[#f0f0f0]" />
            ))}
          </div>
        </div>
      ) : null}

      {!paper && !isPending && displayStatus !== "completed" && displayStatus !== "failed" ? (
        <div className="mx-auto flex max-w-[480px] flex-col items-center gap-8 rounded-3xl bg-white p-8 shadow-[0px_20px_30px_rgba(146,146,146,0.19)] sm:p-10">
          <Spinner />

          <div className="w-full space-y-3 text-center">
            <p className="text-lg font-bold tracking-[-0.04em] text-[#303030]">
              {STATUS_LABELS[displayStatus] ?? "Processing…"}
            </p>
            <p className="text-[15px] text-[rgba(94,94,94,0.8)]">{message}</p>
            <ProgressBar progress={progress} />
            <p className="text-sm font-semibold text-[#303030]">{progress}%</p>
          </div>

          <p className="max-w-[300px] text-center text-sm text-[#a9a9a9]">
            Your question paper is being generated. This usually takes a few seconds.
          </p>
        </div>
      ) : null}

      {displayStatus === "failed" && !paper ? (
        <div className="mx-auto flex max-w-[480px] flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-[0px_20px_30px_rgba(146,146,146,0.19)] text-center sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
              <circle cx="16" cy="16" r="14" stroke="#ef4444" strokeWidth="2"/>
              <path d="M16 9V17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="22" r="1.5" fill="#ef4444"/>
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-[#303030]">Generation Failed</p>
            <p className="text-[15px] text-[rgba(94,94,94,0.8)]">{message}</p>
          </div>
          <Link
            href="/assignments/create"
            className="inline-flex items-center gap-2 rounded-full bg-[#181818] px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Try Again
          </Link>
        </div>
      ) : null}
    </>
  );
}
