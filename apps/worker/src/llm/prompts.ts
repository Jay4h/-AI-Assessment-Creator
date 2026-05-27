import type { CreateAssignmentDto } from "@vedaai/validation";
import type { GeneratedSection } from "./schemas.js";

function sectionTypeLabel(type: CreateAssignmentDto["questionTypes"][number]["type"]): string {
  switch (type) {
    case "multiple_choice":
      return "Multiple Choice — exactly 4 options per question (A), B), C), D))";
    case "short":
      return "Short Answer — answers should be 3–5 lines";
    case "diagram":
      return "Diagram / Graph — describe what to draw or label";
    case "numerical":
      return "Numerical — require calculation and formula use";
    default:
      return type;
  }
}

export function buildSectionPrompt(payload: CreateAssignmentDto, sectionIndex: number): string {
  const row = payload.questionTypes[sectionIndex];
  const letter = String.fromCharCode(65 + sectionIndex);
  const totalMarks = payload.questionTypes.reduce(
    (acc, r) => acc + r.count * r.marksPerQuestion,
    0,
  );

  const teacherNotes = payload.additionalInstructions?.trim()
    ? `\nTeacher notes: ${payload.additionalInstructions.trim()}`
    : "";

  return `Create Section ${letter} of an Indian school exam paper (CBSE / ICSE).

Assignment: "${payload.title}"
Subject: ${payload.subject}
Class: ${payload.className}
Total paper marks: ${totalMarks}${teacherNotes}

Section requirements:
- Section id: "${letter}"
- Type: ${sectionTypeLabel(row.type)}
- Question count: ${row.count} (numbered 1 through ${row.count})
- Marks per question: ${row.marksPerQuestion}

Content rules:
- Every question must be specific to the subject and topic — no placeholders.
- Appropriate difficulty for ${payload.className}.
- Mix difficulties: ~40% easy, ~40% medium/moderate, ~20% hard/challenging.
- Set "marks" to ${row.marksPerQuestion} on every question.
- "title" must be exactly "Section ${letter}".
- "instruction" must be ONE line like: "Attempt all questions. Each question carries ${row.marksPerQuestion} mark(s)." — do not repeat the question type in instruction.`;
}

export function buildAnswerKeyPrompt(
  payload: CreateAssignmentDto,
  sections: GeneratedSection[],
): string {
  const totalMarks = payload.questionTypes.reduce(
    (acc, r) => acc + r.count * r.marksPerQuestion,
    0,
  );

  const paperBody = sections
    .map((section) => {
      const questions = section.questions
        .map((q) => {
          const options = "options" in q ? (q as { options?: string[] }).options : undefined;
          const opts =
            options && options.length > 0
              ? `\n    Options: ${options.join(" | ")}`
              : "";
          return `  Q${q.number} (${q.marks}m): ${q.text}${opts}`;
        })
        .join("\n");
      return `Section ${section.id} — ${section.title}\n${questions}`;
    })
    .join("\n\n");

  const teacherNotes = payload.additionalInstructions?.trim()
    ? ` Include this in generalInstruction: "${payload.additionalInstructions.trim()}".`
    : "";

  return `You are grading an exam paper. Provide a complete answer key and exam metadata.

Assignment: "${payload.title}" | ${payload.subject} | ${payload.className}
Total marks: ${totalMarks}

--- QUESTIONS ---
${paperBody}
--- END ---

Rules:
- One answerKey entry per question (match sectionId and number).
- MCQ answers: give the correct option letter and text.
- Numerical answers: include formula and step-by-step working.
- timeAllowed: realistic duration for ${totalMarks} marks.${teacherNotes}`;
}
