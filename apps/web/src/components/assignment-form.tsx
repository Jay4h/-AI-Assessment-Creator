"use client";

import { useActionState, useMemo, useRef } from "react";
import Link from "next/link";
import { QUESTION_TYPE_OPTIONS } from "@vedaai/content";
import { submitAssignment } from "@/lib/actions";
import { initialFormState } from "@/lib/validation";
import {
  AssignmentFormProvider,
  useAssignmentStore,
} from "./assignment-form-provider";

const initialState = initialFormState;

/* ------------------------------------------------------------------ icons */
function IconMinus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2.5 7H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconPlus({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconCloud() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M14 18V8M14 8L10 12M14 8L18 12" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 16C5.24 16 3 18.24 3 21C3 23.76 5.24 26 8 26H21C23.21 26 25 24.21 25 22C25 20 23.4 18.3 21.4 18C20.6 16.8 18.9 16 17 16" stroke="#303030" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2" y="3.5" width="14" height="12" rx="2" stroke="#a9a9a9" strokeWidth="1.4"/>
      <path d="M2 7.5H16" stroke="#a9a9a9" strokeWidth="1.4"/>
      <path d="M6 2V4.5" stroke="#a9a9a9" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 2V4.5" stroke="#a9a9a9" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconMic() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="7" y="2" width="6" height="9" rx="3" stroke="#5e5e5e" strokeWidth="1.4"/>
      <path d="M4 10C4 13.31 6.69 16 10 16C13.31 16 16 13.31 16 10" stroke="#5e5e5e" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10 16V18.5" stroke="#5e5e5e" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* -------------------------------------------------------------- Stepper */
function Stepper({
  value,
  min = 1,
  onChange,
}: {
  value: number;
  min?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex h-11 w-[108px] items-center justify-between rounded-xl border border-[#e8e8e8] bg-white px-1">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#303030] transition-colors hover:bg-[#f0f0f0]"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease"
      >
        <IconMinus />
      </button>
      <span className="w-6 text-center text-[15px] font-semibold text-[#303030]">{value}</span>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#303030] transition-colors hover:bg-[#f0f0f0]"
        onClick={() => onChange(value + 1)}
        aria-label="Increase"
      >
        <IconPlus />
      </button>
    </div>
  );
}

/* -------------------------------------------------------- Inner form */
function AssignmentFormInner() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(submitAssignment, initialState);

  const draft = useAssignmentStore((s) => s.draft);
  const setTitle = useAssignmentStore((s) => s.setTitle);
  const setSubject = useAssignmentStore((s) => s.setSubject);
  const setClassName = useAssignmentStore((s) => s.setClassName);
  const setDueDate = useAssignmentStore((s) => s.setDueDate);
  const setFileName = useAssignmentStore((s) => s.setFileName);
  const setInstructions = useAssignmentStore((s) => s.setInstructions);
  const updateRow = useAssignmentStore((s) => s.updateRow);
  const addRow = useAssignmentStore((s) => s.addRow);
  const removeRow = useAssignmentStore((s) => s.removeRow);

  const { questions, marks } = useMemo(
    () =>
      draft.questionTypes.reduce(
        (acc, row) => ({
          questions: acc.questions + row.count,
          marks: acc.marks + row.count * row.marksPerQuestion,
        }),
        { questions: 0, marks: 0 },
      ),
    [draft.questionTypes],
  );

  return (
    <form
      action={formAction}
      className="mx-auto max-w-[760px] space-y-6 px-2 pb-24 sm:space-y-8"
    >
      <input type="hidden" name="rowCount" value={draft.questionTypes.length} />

      {/* Page header */}
      <header className="space-y-4">
        {/* Title and Back button row */}
        <div className="flex items-center gap-3">
          <Link
            href="/assignments"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.05)] text-[#303030] transition-opacity hover:opacity-85 lg:hidden"
            aria-label="Go back"
          >
            <IconArrowLeft />
          </Link>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-[-0.04em] text-[#303030] sm:text-2xl">
              Create Assignment
            </h1>
          </div>
        </div>

        {/* Progress bar split into 2 visual steps */}
        <div className="flex gap-2 w-full">
          <div className="h-1.5 flex-1 rounded-full bg-[#5e5e5e]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#e0e0e0]" />
        </div>
      </header>

      {/* Card */}
      <section className="rounded-[32px] bg-white p-5 shadow-[0px_16px_36px_rgba(120,120,120,0.06)] sm:p-8 lg:p-10">
        <h2 className="text-[19px] font-bold tracking-[-0.04em] text-[#303030]">
          Assignment Details
        </h2>
        <p className="mt-0.5 text-[14px] text-[#8e8e8e]">
          Basic information about your assignment
        </p>

        <div className="mt-6 space-y-6">
          {/* Title, Subject, Class fields */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="title" className="text-[13px] font-semibold text-[#303030]">
                Assignment Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Mid-term Test"
                value={draft.title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#e8e8e8] bg-white px-4 py-2.5 text-[15px] text-[#303030] placeholder:text-[#a9a9a9] outline-none focus:border-[#303030] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="subject" className="text-[13px] font-semibold text-[#303030]">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="e.g. Mathematics"
                value={draft.subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#e8e8e8] bg-white px-4 py-2.5 text-[15px] text-[#303030] placeholder:text-[#a9a9a9] outline-none focus:border-[#303030] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="className" className="text-[13px] font-semibold text-[#303030]">
                Class
              </label>
              <input
                id="className"
                name="className"
                type="text"
                required
                placeholder="e.g. Class 10-A"
                value={draft.className}
                onChange={(e) => setClassName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#e8e8e8] bg-white px-4 py-2.5 text-[15px] text-[#303030] placeholder:text-[#a9a9a9] outline-none focus:border-[#303030] transition-colors"
              />
            </div>
          </div>

          {/* File upload zone */}
          <div
            className="flex flex-col items-center rounded-2xl border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] px-4 py-7 text-center sm:px-10 cursor-pointer hover:bg-[#f6f6f6] transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) setFileName(file.name);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <span className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-50">
              <IconCloud />
            </span>
            <p className="font-semibold text-[#303030] text-[15px]">Choose a file or drag & drop it here</p>
            <p className="mt-0.5 text-xs text-[#a9a9a9]">JPEG, PNG, up to 10MB</p>
            <input
              ref={fileRef}
              type="file"
              name="material"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileName(file?.name);
              }}
            />
            <button
              type="button"
              className="mt-4 rounded-full border border-[#e8e8e8] bg-white px-6 py-2 text-xs font-semibold text-[#303030] shadow-sm transition-colors hover:bg-[#f0f0f0]"
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
            >
              Browse Files
            </button>
            {draft.fileName ? (
              <p className="mt-3 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Selected: {draft.fileName}</p>
            ) : null}
          </div>
          <p className="text-center text-xs text-[#a9a9a9] -mt-3">
            Upload images of your preferred document/ image
          </p>

          {/* Due date */}
          <div>
            <label htmlFor="dueDate" className="text-[13px] font-semibold text-[#303030]">
              Due Date
            </label>
            <div className="relative mt-2">
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                value={draft.dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-[#e8e8e8] bg-white px-4 py-2.5 text-[15px] text-[#303030] outline-none focus:border-[#303030] transition-colors"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IconCalendar />
              </span>
            </div>
            {state.errors.dueDate ? (
              <p className="mt-1 text-xs text-red-600">{state.errors.dueDate}</p>
            ) : null}
          </div>

          {/* Question type cards */}
          <div className="space-y-4">
            <p className="text-[14px] font-bold text-[#303030]">Question Type</p>
            <div className="space-y-4">
              {draft.questionTypes.map((row, index) => (
                <div key={row.id} className="relative rounded-[24px] border border-[#e8e8e8] bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
                  <input type="hidden" name={`type-${index}`} value={row.type} />
                  <input type="hidden" name={`label-${index}`} value={row.label} />
                  <input type="hidden" name={`count-${index}`} value={row.count} />
                  <input type="hidden" name={`marks-${index}`} value={row.marksPerQuestion} />

                  {/* Header Row: Type Dropdown & Remove Button */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Dropdown container */}
                    <div className="relative flex-1">
                      <select
                        value={row.type}
                        onChange={(e) => {
                          const opt = QUESTION_TYPE_OPTIONS.find((o) => o.value === e.target.value);
                          updateRow(row.id, {
                            type: e.target.value as typeof row.type,
                            label: opt?.label ?? row.label,
                          });
                        }}
                        className="w-full appearance-none bg-transparent py-1.5 pl-0 pr-8 text-[15px] font-semibold text-[#303030] outline-none cursor-pointer"
                      >
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {/* Chevron icon */}
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>

                    {/* Remove button */}
                    {draft.questionTypes.length > 1 && (
                      <button
                        type="button"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                        onClick={() => removeRow(row.id)}
                        aria-label="Remove question type"
                      >
                        <IconX />
                      </button>
                    )}
                  </div>

                  {/* Steppers container block (gray rounded capsule card) */}
                  <div className="mt-3 grid grid-cols-2 gap-4 rounded-[20px] bg-[#f6f6f6] p-3.5">
                    {/* Questions stepper */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[#5e5e5e]">No. of Questions</span>
                      <div className="flex h-10 w-full items-center justify-between rounded-full bg-white px-1 shadow-[0px_2px_4px_rgba(0,0,0,0.03)] border border-gray-100">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5e5e5e] hover:bg-[#f6f6f6] transition-colors"
                          onClick={() => updateRow(row.id, { count: Math.max(1, row.count - 1) })}
                        >
                          <IconMinus />
                        </button>
                        <span className="text-[14px] font-bold text-[#303030]">{row.count}</span>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5e5e5e] hover:bg-[#f6f6f6] transition-colors"
                          onClick={() => updateRow(row.id, { count: row.count + 1 })}
                        >
                          <IconPlus />
                        </button>
                      </div>
                    </div>

                    {/* Marks stepper */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[#5e5e5e]">Marks</span>
                      <div className="flex h-10 w-full items-center justify-between rounded-full bg-white px-1 shadow-[0px_2px_4px_rgba(0,0,0,0.03)] border border-gray-100">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5e5e5e] hover:bg-[#f6f6f6] transition-colors"
                          onClick={() => updateRow(row.id, { marksPerQuestion: Math.max(1, row.marksPerQuestion - 1) })}
                        >
                          <IconMinus />
                        </button>
                        <span className="text-[14px] font-bold text-[#303030]">{row.marksPerQuestion}</span>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5e5e5e] hover:bg-[#f6f6f6] transition-colors"
                          onClick={() => updateRow(row.id, { marksPerQuestion: row.marksPerQuestion + 1 })}
                        >
                          <IconPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add question type button */}
            <button
              type="button"
              onClick={addRow}
              className="mt-4 flex items-center gap-2.5 text-[15px] font-semibold text-[#303030] transition-opacity hover:opacity-75"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#181818] text-white shadow-sm">
                <IconPlus size={14} />
              </span>
              Add Question Type
            </button>
          </div>

          {/* Total display */}
          <div className="flex flex-col items-end gap-0.5 pt-2 text-[14px] font-bold text-[#5e5e5e]">
            <p>Total Questions : <span className="text-[#303030]">{questions}</span></p>
            <p>Total Marks : <span className="text-[#303030]">{marks}</span></p>
          </div>

          {/* Additional Instructions */}
          <div className="pt-2">
            <label htmlFor="instructions" className="text-[13px] font-semibold text-[#303030]">
              Additional Information{" "}
              <span className="font-normal text-[#a9a9a9]">(For better output)</span>
            </label>
            <div className="relative mt-2">
              <textarea
                id="instructions"
                name="additionalInstructions"
                rows={4}
                value={draft.additionalInstructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Generate a question paper for a 3-hour exam duration..."
                className="w-full resize-none rounded-2xl border border-[#e8e8e8] bg-white p-4 pr-12 text-[15px] text-[#303030] placeholder:text-[#a9a9a9] outline-none focus:border-[#303030] transition-colors"
              />
              <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f6f6] text-[#5e5e5e]">
                <IconMic />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Form-level error */}
      {state.errors._form ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.errors._form}
        </p>
      ) : null}

      {/* Actions (Aligned Previous / Next Capsule Row) */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link
          href="/assignments"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-6 py-3 text-[15px] font-semibold text-[#303030] transition-colors hover:bg-[#f6f6f6] shadow-sm flex-1 max-w-[160px] h-12"
        >
          <IconArrowLeft />
          Previous
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181818] px-7 py-3 text-[15px] font-semibold text-white transition-opacity disabled:opacity-60 hover:opacity-90 shadow-sm flex-1 max-w-[160px] h-12"
        >
          {pending ? "Generating…" : "Next"}
          {!pending && <IconArrowRight />}
        </button>
      </div>
    </form>
  );
}

export function AssignmentForm() {
  return (
    <AssignmentFormProvider>
      <AssignmentFormInner />
    </AssignmentFormProvider>
  );
}
