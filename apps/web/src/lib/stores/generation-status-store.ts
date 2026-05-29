import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import type { GenerationProgressEvent, GenerationJobStatus } from "@vedaai/types";

interface GenerationStatusState {
  events: Record<string, GenerationProgressEvent>;
  setStatus: (event: GenerationProgressEvent) => void;
  clearStatus: (assignmentId: string) => void;
}

export const generationStatusStore = createStore<GenerationStatusState>((set) => ({
  events: {},
  setStatus: (event) =>
    set((s) => ({
      events: { ...s.events, [event.assignmentId]: event },
    })),
  clearStatus: (assignmentId) =>
    set((s) => {
      const { [assignmentId]: _, ...rest } = s.events;
      return { events: rest };
    }),
}));

export function useAssignmentStatus(assignmentId: string): {
  status: GenerationJobStatus | "idle";
  message: string;
  progress: number;
} {
  const event = useStore(generationStatusStore, (s) => s.events[assignmentId] ?? null);
  return {
    status: event?.status ?? "idle",
    message: event?.message ?? "Waiting to start…",
    progress: event?.progress ?? 0,
  };
}
