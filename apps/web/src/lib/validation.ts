import type { AssignmentDraft } from "@vedaai/types";

export type FormState = {
  ok: boolean;
  errors: Record<string, string>;
};

export const initialFormState: FormState = { ok: false, errors: {} };

export function validateDraft(draft: AssignmentDraft): FormState {
  const errors: Record<string, string> = {};
  if (!draft.dueDate.trim()) errors.dueDate = "Due date is required";
  if (draft.questionTypes.length === 0) {
    errors.questionTypes = "Add at least one question type";
  }
  draft.questionTypes.forEach((row, i) => {
    if (row.count < 1) errors[`count-${i}`] = "Must be at least 1";
    if (row.marksPerQuestion < 1) errors[`marks-${i}`] = "Must be at least 1";
  });
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {} };
}
