"use client";

import type { QuestionPaper } from "@vedaai/types";

const difficultyBracket: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  medium: "Moderate",
  hard: "Challenging",
  challenging: "Challenging",
};

function parseSectionInstruction(instruction: string): {
  typeHeading: string | null;
  attemptLine: string;
} {
  const split = instruction.split(/\s+[—–-]\s+/);
  if (split.length >= 2) {
    return { typeHeading: split[0].trim(), attemptLine: split.slice(1).join(" — ").trim() };
  }
  return { typeHeading: null, attemptLine: instruction };
}

function orderedAnswerKey(paper: QuestionPaper): { number: number; answer: string }[] {
  if (!paper.answerKey?.length) return [];

  const items: { number: number; answer: string }[] = [];
  let displayNumber = 1;

  for (const section of paper.sections) {
    for (const q of section.questions) {
      const entry =
        paper.answerKey.find((a) => a.sectionId === section.id && a.number === q.number) ??
        paper.answerKey.find((a) => a.number === q.number && !a.sectionId);
      if (entry) {
        items.push({ number: displayNumber, answer: entry.answer });
        displayNumber += 1;
      }
    }
  }

  return items;
}

function IconDownload() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M10.414 2.05532C10.2106 2.00649 9.98288 2.00006 9.20151 2.00006H6.98974C6.13316 2.00006 5.55086 2.00084 5.10077 2.03761C4.66236 2.07343 4.43816 2.13836 4.28176 2.21805C3.90543 2.4098 3.59947 2.71576 3.40772 3.09208C3.32803 3.24848 3.26311 3.47269 3.22729 3.9111C3.19051 4.36119 3.18974 4.94348 3.18974 5.80006V9.00006H1.18974L1.18974 5.75876C1.18972 4.95379 1.18971 4.28943 1.23393 3.74824C1.27986 3.18614 1.37842 2.66944 1.62571 2.1841C2.0092 1.43145 2.62113 0.81953 3.37377 0.436037C3.85911 0.188746 4.37581 0.0901819 4.93791 0.0442567C5.47911 3.9354e-05 6.14347 4.98449e-05 6.94844 6.26003e-05L9.20151 6.30771e-05C9.23592 6.30771e-05 9.26987 4.68646e-05 9.30339 3.08906e-05C9.93839 -0.000271186 10.4182 -0.000499591 10.8809 0.110583C11.289 0.20857 11.6792 0.370188 12.0371 0.589502C12.4428 0.838129 12.7819 1.17756 13.2307 1.62678C13.2544 1.65049 13.2784 1.67451 13.3027 1.69884L15.491 3.88707C15.5153 3.9114 15.5393 3.9354 15.563 3.95909C16.0122 4.40789 16.3517 4.74699 16.6003 5.15271C16.8196 5.5106 16.9812 5.90078 17.0792 6.30892C17.1903 6.77162 17.1901 7.25141 17.1898 7.8864C17.1898 7.91993 17.1897 7.95388 17.1897 7.98829V12.2413C17.1897 13.0463 17.1898 13.7107 17.1455 14.2519C17.0996 14.814 17.0011 15.3307 16.7538 15.816C16.3703 16.5687 15.7583 17.1806 15.0057 17.5641C14.5204 17.8114 14.0037 17.9099 13.4416 17.9559C12.9004 18.0001 12.236 18.0001 11.4311 18.0001H10.1897V16.0001H11.3897C12.2463 16.0001 12.8286 15.9993 13.2787 15.9625C13.7171 15.9267 13.9413 15.8618 14.0977 15.7821C14.474 15.5903 14.78 15.2844 14.9717 14.908C15.0514 14.7516 15.1164 14.5274 15.1522 14.089C15.189 13.6389 15.1897 13.0566 15.1897 12.2001V7.98829C15.1897 7.20692 15.1833 6.97922 15.1345 6.77581C15.0855 6.57174 15.0047 6.37665 14.895 6.19771C14.7857 6.01935 14.6293 5.85379 14.0767 5.30128L11.8885 3.11306C11.336 2.56055 11.1705 2.40408 10.9921 2.29478C10.8131 2.18513 10.6181 2.10432 10.414 2.05532Z" fill="#303030"/>
<path fillRule="evenodd" clipRule="evenodd" d="M2.71539 13.5257L3.62053 10.8103H4.75895L5.66408 13.5257L8.37947 14.4309V15.5693L5.66408 16.4744L4.75895 19.1898H3.62053L2.71539 16.4744L0 15.5693V14.4309L2.71539 13.5257Z" fill="#303030"/>
<path fillRule="evenodd" clipRule="evenodd" d="M11.1897 2.00006V6.00006H15.1897V8.00006H10.1897C9.63745 8.00006 9.18974 7.55235 9.18974 7.00006V2.00006H11.1897Z" fill="#303030"/>
</svg>

  );
}

function FieldLine({ label, placeholder = "_____________________" }: { label: string; placeholder?: string }) {
  return (
    <p className="text-[15px] font-semibold leading-relaxed text-[#303030]">
      {label}
      <span className="decoration-1">
        {placeholder}
      </span>
    </p>
  );
}

export function QuestionPaperView({ paper }: { paper: QuestionPaper }) {
  const answers = orderedAnswerKey(paper);

  return (
    <div className="flex flex-col gap-5 print:gap-0 print:p-0">
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

      <article className="rounded-3xl bg-white p-5 shadow-[0px_20px_30px_rgba(146,146,146,0.19)] sm:p-7 lg:p-10 print:shadow-none print:p-0 print:rounded-none">
        <header className="text-[#303030]">
          <div className="text-center">
            <h1 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">
              {paper.schoolName}
            </h1>
            <p className="mt-2 text-base font-bold sm:text-lg">Subject: {paper.subject}</p>
            <p className="mt-1 text-base font-bold sm:text-lg">Class: {paper.className}</p>
          </div>

          <div className="mt-6 flex flex-row items-baseline justify-between gap-4 text-[15px] font-semibold">
            <span>Time Allowed: {paper.timeAllowed}</span>
            <span className="shrink-0">Maximum Marks: {paper.maximumMarks}</span>
          </div>

          <p className="mt-5 text-left text-[15px] font-semibold leading-relaxed">
            {paper.generalInstruction}
          </p>

          <div className="mt-5 space-y-2 text-left">
            <FieldLine label="Name: " />
            <FieldLine label="Roll Number: " />
            <FieldLine label={`Class: ${paper.className} Section: `} />
          </div>
        </header>

        {/* Sections — each question type is its own section block */}
        <div className="mt-8 space-y-10 print:space-y-8">
          {paper.sections.map((section, sIdx) => {
            const parsed = parseSectionInstruction(section.instruction);
            const typeHeading = section.typeLabel ?? parsed.typeHeading;

            return (
              <section key={`${section.id}-${sIdx}`} className="print:break-inside-avoid">
                <h2 className="text-center text-xl font-bold text-[#303030] sm:text-2xl">
                  {section.title}
                </h2>

                {typeHeading ? (
                  <p className="mt-4 text-left text-base font-bold text-[#303030]">{typeHeading}</p>
                ) : null}

                <p className="mt-1 text-left text-[15px] italic text-[#303030]">
                  {parsed.attemptLine}
                </p>

                <ol className="mt-5 list-none space-y-4 pl-0">
                  {section.questions.map((q) => (
                    <li
                      key={q.id}
                      className="text-[15px] leading-relaxed text-[#303030]"
                    >
                      <p>
                        {q.number}. [{difficultyBracket[q.difficulty] ?? q.difficulty}] {q.text}{" "}
                        [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
                      </p>
                      {q.options && q.options.length > 0 ? (
                        <ul className="mt-2 list-none space-y-1 pl-6">
                          {q.options.map((opt, oIdx) => (
                            <li key={oIdx}>{opt}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>

        <p className="mt-10 text-left text-[15px] font-bold text-[#303030]">
          End of Question Paper
        </p>

        {answers.length > 0 ? (
          <div className="mt-8 print:break-before-page">
            <h3 className="text-base font-bold text-[#303030]">Answer Key:</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-6 text-[15px] leading-relaxed text-[#303030]">
              {answers.map((a) => (
                <li key={a.number}>{a.answer}</li>
              ))}
            </ol>
          </div>
        ) : null}
      </article>
    </div>
  );
}
