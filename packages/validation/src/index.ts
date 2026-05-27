import { z } from "zod";

export const questionTypeRowSchema = z.object({
  id: z.string().min(1).optional(),
  type: z.enum(["multiple_choice", "short", "diagram", "numerical"]),
  label: z.string().min(1),
  count: z.number().int().min(1),
  marksPerQuestion: z.number().int().min(1),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(2),
  className: z.string().min(1),
  dueDate: z.string().min(1),
  additionalInstructions: z.string().optional().default(""),
  questionTypes: z.array(questionTypeRowSchema).min(1),
});

export const assignmentIdSchema = z.object({
  assignmentId: z.string().min(1),
});

export type CreateAssignmentDto = z.infer<typeof createAssignmentSchema>;
