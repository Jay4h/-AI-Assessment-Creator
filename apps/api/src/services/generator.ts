import type { QuestionPaper } from "@vedaai/types";
import type { CreateAssignmentDto } from "@vedaai/validation";

export function generateQuestionPaperJson(
  assignmentId: string,
  input: CreateAssignmentDto,
): QuestionPaper {
  const totalMarks = input.questionTypes.reduce(
    (acc, row) => acc + row.count * row.marksPerQuestion,
    0,
  );

  const questions = input.questionTypes.flatMap((row, rowIdx) =>
    Array.from({ length: row.count }, (_, i) => ({
      id: `${row.type}-${rowIdx + 1}-${i + 1}`,
      number: i + 1,
      text: `${row.label}: Question ${i + 1} for ${input.subject}`,
      difficulty: (i % 3 === 0
        ? "easy"
        : i % 3 === 1
          ? "moderate"
          : "hard") as "easy" | "moderate" | "hard",
      marks: row.marksPerQuestion,
    })),
  );

  return {
    id: assignmentId,
    schoolName: "Delhi Public School, Sector-4, Bokaro",
    subject: input.subject,
    className: input.className,
    timeAllowed: "45 minutes",
    maximumMarks: totalMarks,
    generalInstruction: "All questions are compulsory unless stated otherwise.",
    introMessage:
      "Structured paper generated from assignment input. Replace with LLM pipeline output.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instruction: "Attempt all questions",
        questions,
      },
    ],
    answerKey: questions.map((q) => ({
      number: q.number,
      answer: `Model answer for ${q.text}`,
    })),
  };
}
