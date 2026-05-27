import { Router } from "express";
import { z } from "zod";
import {
  assignmentIdSchema,
  createAssignmentSchema,
} from "@vedaai/validation";
import { AssignmentModel, QuestionPaperModel } from "../db/models";
import type { Queue } from "bullmq";
import type { GenerationJobData } from "../queue/queues";

export function createAssignmentsRouter(generationQueue: Queue<GenerationJobData>) {
  const router = Router();

  router.post("/", async (req, res) => {
    const parsed = createAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
    }

    const created = await AssignmentModel.create({
      ...parsed.data,
      status: "queued",
    });

    await generationQueue.add("generate-assessment", {
      assignmentId: String(created._id),
      payload: {
        ...parsed.data,
        questionTypes: parsed.data.questionTypes.map((row, idx) => ({
          ...row,
          id: row.id ?? `row-${idx + 1}`,
        })),
      },
    });

    return res.status(202).json({
      assignmentId: String(created._id),
      status: "queued",
    });
  });

  router.get("/", async (_req, res) => {
    const assignments = (await AssignmentModel.find()
      .sort({ createdAt: -1 })
      .lean()) as any[];
    return res.status(200).json(
      assignments.map((a) => ({
        id: String(a._id),
        title: a.title,
        subject: a.subject,
        className: a.className,
        dueDate: a.dueDate,
        status: a.status,
        createdAt: a.createdAt,
      })),
    );
  });

  router.get("/:assignmentId", async (req, res) => {
    const parsed = assignmentIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid assignment id" });
    }

    const assignment = (await AssignmentModel.findById(
      parsed.data.assignmentId,
    ).lean()) as any;
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    return res.status(200).json({
      id: String(assignment._id),
      title: assignment.title,
      subject: assignment.subject,
      className: assignment.className,
      dueDate: assignment.dueDate,
      status: assignment.status,
      questionPaperId: assignment.questionPaperId ?? null,
    });
  });

  router.get("/:assignmentId/output", async (req, res) => {
    const parsed = assignmentIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid assignment id" });
    }

    const assignment = (await AssignmentModel.findById(
      parsed.data.assignmentId,
    ).lean()) as any;
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    if (!assignment.questionPaperId) {
      return res.status(202).json({ status: assignment.status, output: null });
    }

    const paper = (await QuestionPaperModel.findOne({
      id: assignment.questionPaperId,
    }).lean()) as any;
    if (!paper) return res.status(404).json({ error: "Generated paper missing" });

    return res.status(200).json({ status: assignment.status, output: paper });
  });

  router.post("/:assignmentId/regenerate", async (req, res) => {
    const parsed = assignmentIdSchema.safeParse(req.params);
    const body = z
      .object({
        target: z.enum(["section", "question"]),
        sectionId: z.string().optional(),
        questionNumber: z.number().int().positive().optional(),
      })
      .safeParse(req.body);
    if (!parsed.success || !body.success) {
      return res.status(400).json({ error: "Invalid regeneration payload" });
    }

    const assignment = (await AssignmentModel.findById(
      parsed.data.assignmentId,
    ).lean()) as any;
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    await generationQueue.add("regenerate-assessment", {
      assignmentId: String(assignment._id),
      payload: {
        title: assignment.title,
        subject: assignment.subject,
        className: assignment.className,
        dueDate: assignment.dueDate,
        additionalInstructions: assignment.additionalInstructions,
        questionTypes: assignment.questionTypes,
      },
    });

    return res.status(202).json({
      assignmentId: String(assignment._id),
      status: "queued",
      regenerate: body.data,
    });
  });

  router.delete("/:assignmentId", async (req, res) => {
    const parsed = assignmentIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid assignment id" });
    }

    const assignment = await AssignmentModel.findByIdAndDelete(parsed.data.assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Also delete any associated generated paper
    await QuestionPaperModel.deleteOne({ id: parsed.data.assignmentId });

    return res.status(200).json({ ok: true, message: "Assignment deleted successfully" });
  });

  return router;
}
