import { createStore } from "zustand/vanilla";
import type { AssignmentDraft, QuestionTypeRow } from "@vedaai/types";
import { QUESTION_TYPE_OPTIONS } from "@vedaai/content";

function defaultRows(): QuestionTypeRow[] {
  return QUESTION_TYPE_OPTIONS.slice(0, 4).map((opt, i) => ({
    id: `row-${i}`,
    type: opt.value,
    label: opt.label,
    count: [4, 3, 5, 5][i] ?? 1,
    marksPerQuestion: [1, 2, 5, 5][i] ?? 1,
  }));
}

export interface AssignmentStore {
  draft: AssignmentDraft;
  setTitle: (title: string) => void;
  setSubject: (subject: string) => void;
  setClassName: (className: string) => void;
  setDueDate: (dueDate: string) => void;
  setFileName: (fileName: string | undefined) => void;
  setInstructions: (text: string) => void;
  updateRow: (id: string, patch: Partial<QuestionTypeRow>) => void;
  addRow: () => void;
  removeRow: (id: string) => void;
  totals: () => { questions: number; marks: number };
}

export function createAssignmentStore(initial?: Partial<AssignmentDraft>) {
  return createStore<AssignmentStore>((set, get) => ({
    draft: {
      title: "",
      subject: "",
      className: "",
      dueDate: "",
      fileName: undefined,
      questionTypes: defaultRows(),
      additionalInstructions: "",
      ...initial,
    },
    setTitle: (title) => set((s) => ({ draft: { ...s.draft, title } })),
    setSubject: (subject) => set((s) => ({ draft: { ...s.draft, subject } })),
    setClassName: (className) => set((s) => ({ draft: { ...s.draft, className } })),
    setDueDate: (dueDate) =>
      set((s) => ({ draft: { ...s.draft, dueDate } })),
    setFileName: (fileName) =>
      set((s) => ({ draft: { ...s.draft, fileName } })),
    setInstructions: (additionalInstructions) =>
      set((s) => ({ draft: { ...s.draft, additionalInstructions } })),
    updateRow: (id, patch) =>
      set((s) => ({
        draft: {
          ...s.draft,
          questionTypes: s.draft.questionTypes.map((r) =>
            r.id === id ? { ...r, ...patch } : r,
          ),
        },
      })),
    addRow: () =>
      set((s) => ({
        draft: {
          ...s.draft,
          questionTypes: [
            ...s.draft.questionTypes,
            {
              id: `row-${Date.now()}`,
              type: "short",
              label: "Short Questions",
              count: 1,
              marksPerQuestion: 1,
            },
          ],
        },
      })),
    removeRow: (id) =>
      set((s) => ({
        draft: {
          ...s.draft,
          questionTypes: s.draft.questionTypes.filter((r) => r.id !== id),
        },
      })),
    totals: () => {
      const rows = get().draft.questionTypes;
      return rows.reduce(
        (acc, r) => ({
          questions: acc.questions + r.count,
          marks: acc.marks + r.count * r.marksPerQuestion,
        }),
        { questions: 0, marks: 0 },
      );
    },
  }));
}

export type AssignmentStoreApi = ReturnType<typeof createAssignmentStore>;
