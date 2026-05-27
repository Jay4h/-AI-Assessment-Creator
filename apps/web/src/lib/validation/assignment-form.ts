export type FormState = {
  ok: boolean;
  errors: Record<string, string>;
};

export const initialFormState: FormState = { ok: false, errors: {} };
