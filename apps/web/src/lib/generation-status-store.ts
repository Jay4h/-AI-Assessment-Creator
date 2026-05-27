import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import type { GenerationProgressEvent, GenerationJobStatus } from "@vedaai/types";

interface GenerationStatusState {
  /** keyed by assignmentId */
  events: Record<string, GenerationProgressEvent>;
  setStatus: (event: GenerationProgressEvent) => void;
  getStatus: (assignmentId: string) => GenerationProgressEvent | null;
}

/**
 * Module-level singleton store so any component can read status without
 * needing a React context tree (mirrors the vanilla store pattern).
 */
export const generationStatusStore = createStore<GenerationStatusState>((set, get) => ({
  events: {},
  setStatus: (event) =>
    set((s) => ({
      events: { ...s.events, [event.assignmentId]: event },
    })),
  getStatus: (assignmentId) => get().events[assignmentId] ?? null,
}));

/** React hook — re-renders only when the event for this assignmentId changes */
export function useGenerationStatus(assignmentId: string): GenerationProgressEvent | null {
  return useStore(generationStatusStore, (s) => s.events[assignmentId] ?? null);
}

/** Convenience: derive a simple status string with a fallback */
export function useAssignmentStatus(assignmentId: string): {
  status: GenerationJobStatus | "idle";
  message: string;
  progress: number;
} {
  const event = useGenerationStatus(assignmentId);
  return {
    status: event?.status ?? "idle",
    message: event?.message ?? "Waiting to start…",
    progress: event?.progress ?? 0,
  };
}
