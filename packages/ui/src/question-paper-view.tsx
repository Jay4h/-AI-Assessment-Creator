"use client";

import type { QuestionPaper, QuestionPaperQuestion } from "@vedaai/types";
import type { ContentNode } from "@vedaai/content";
import { ContentRenderer } from "./content-renderer";

const difficultyLabel: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
  challenging: "Challenging",
};

function questionToNodes(q: QuestionPaperQuestion): ContentNode[] {
  return [
    {
      type: "text",
      variant: "body",
      value: `${q.text}`,
      as: "span",
    },
  ];
}

function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M9 3V11M9 11L5.5 7.5M9 11L12.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 14H15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function QuestionPaperView({ paper }: { paper: QuestionPaper }) {
  const headerNodes: ContentNode[] = [
    {
      type: "text",
      variant: "title",
      value: paper.schoolName,
      as: "h1",
    },
    {
      type: "stack",
      direction: "column",
      gap: 1,
      children: [
        {
          type: "text",
          variant: "body",
          value: `Subject: ${paper.subject}`,
          as: "p",
        },
        {
          type: "text",
          variant: "body",
          value: `Class: ${paper.className}`,
          as: "p",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-5 print:gap-0 print:p-0">
      {/* Dark intro card */}
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-[rgba(24,24,24,0.85)] px-5 py-6 text-center text-white backdrop-blur-sm sm:px-8 sm:py-7 print:hidden">
        <p className="max-w-[560px] text-base font-semibold leading-snug sm:text-lg">
          {paper.introMessage}
        </p>
        <button
          type="button"
          onClick={() => typeof window !== "undefined" && window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#303030] transition-opacity hover:opacity-85 shadow-sm"
        >
          <IconDownload />
          Download as PDF
        </button>
      </div>

      {/* White question paper card */}
      <article className="rounded-3xl bg-white p-5 shadow-[0px_20px_30px_rgba(146,146,146,0.19)] sm:p-7 lg:p-10 print:shadow-none print:p-0 print:rounded-none">
        {/* Header */}
        <div className="text-center">
          <ContentRenderer nodes={headerNodes} />
        </div>

        {/* Time & Marks */}
        <div className="mt-6 flex flex-col items-center gap-1 rounded-xl bg-[#f6f6f6] px-4 py-3 text-[15px] font-semibold text-[#303030] sm:flex-row sm:justify-between print:bg-gray-50 print:border print:border-gray-200">
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.maximumMarks}</span>
        </div>

        {/* General instruction */}
        <p className="mt-5 text-center text-[15px] font-semibold italic text-[#5e5e5e]">
          {paper.generalInstruction}
        </p>

        {/* Student details */}
        <div className="mt-6 space-y-2 border-t border-[#f0f0f0] pt-4 text-[15px] font-semibold text-[#303030]">
          <ContentRenderer
            nodes={[
              { type: "field-line", label: "Name: " },
              { type: "field-line", label: "Roll Number: " },
              {
                type: "field-line",
                label: `Class: ${paper.className} Section: `,
              },
            ]}
          />
        </div>

        {/* Sections */}
        {paper.sections.map((section, sIdx) => (
          <section key={`${section.id}-${sIdx}`} className="mt-8 border-t border-[#f0f0f0] pt-6 print:break-inside-avoid">
            <h2 className="text-center text-lg font-bold tracking-[-0.02em] text-[#303030] sm:text-xl">
              {section.title}
            </h2>
            <p className="mt-1 text-center text-[15px] font-medium text-[#5e5e5e]">
              {section.instruction}
            </p>
            <ol className="mt-5 list-decimal space-y-4 pl-5 text-[15px] leading-relaxed text-[#303030] sm:pl-6">
              {section.questions.map((q, qIdx) => (
                <li key={`${section.id}-${sIdx}-${qIdx}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex-1">{q.text}</span>
                    <span className="shrink-0 rounded-md bg-[#f6f6f6] px-2 py-0.5 text-sm font-semibold">
                      [{q.marks} M]
                    </span>
                  </div>
                  <span className="mt-0.5 inline-block rounded text-xs font-medium text-[#a9a9a9]">
                    {difficultyLabel[q.difficulty]}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <p className="mt-10 text-center text-[15px] font-bold text-[#303030]">
          — End of Question Paper —
        </p>

        {/* Answer key */}
        {paper.answerKey && paper.answerKey.length > 0 ? (
          <div className="mt-8 border-t border-[#f0f0f0] pt-6 print:break-before-page">
            <h3 className="text-lg font-bold text-[#303030] sm:text-xl">Answer Key</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px] text-[#5e5e5e] sm:pl-6">
              {paper.answerKey.map((a, idx) => (
                <li key={idx}>{a.answer}</li>
              ))}
            </ol>
          </div>
        ) : null}
      </article>
    </div>
  );
}
