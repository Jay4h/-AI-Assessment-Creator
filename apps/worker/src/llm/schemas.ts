import { z } from "zod";
import type { CreateAssignmentDto } from "@vedaai/validation";

const difficultySchema = z.enum(["easy", "moderate", "medium", "hard", "challenging"]);

/** Zod schemas used for OpenAI structured outputs (one section per API call). */
export function sectionSchemaFor(row: CreateAssignmentDto["questionTypes"][number]) {
  const baseQuestion = {
    number: z.number().int().positive(),
    text: z.string().min(5),
    difficulty: difficultySchema,
    marks: z.number().int().positive(),
  };

  const questionSchema =
    row.type === "multiple_choice"
      ? z.object({
          ...baseQuestion,
          options: z
            .array(z.string().min(1))
            .length(4)
            .describe("Exactly 4 options labeled A), B), C), D)"),
        })
      : z.object(baseQuestion);

  return z.object({
    id: z.string().describe("Section letter id, e.g. A"),
    title: z.string(),
    instruction: z.string().describe("Instructions shown to students for this section"),
    questions: z.array(questionSchema).length(row.count),
  });
}

export function answerKeySchema(totalQuestions: number) {
  return z.object({
    answerKey: z
      .array(
        z.object({
          number: z.number().int().positive(),
          sectionId: z.string(),
          answer: z.string().min(1),
        }),
      )
      .length(totalQuestions),
    generalInstruction: z.string(),
    timeAllowed: z.string().describe('e.g. "2 hours" or "1 hour 30 minutes"'),
  });
}

export type GeneratedSection = z.infer<ReturnType<typeof sectionSchemaFor>>;
export type GeneratedAnswerKey = z.infer<ReturnType<typeof answerKeySchema>>;
