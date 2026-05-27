import mongoose, { Schema } from "mongoose";

const questionTypeSchema = new Schema(
  {
    id: String,
    type: { type: String, required: true },
    label: { type: String, required: true },
    count: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true },
  },
  { _id: false },
);

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    dueDate: { type: String, required: true },
    additionalInstructions: { type: String, default: "" },
    questionTypes: { type: [questionTypeSchema], required: true },
    status: { type: String, required: true, default: "queued" },
    questionPaperId: { type: String },
  },
  { timestamps: true },
);

const questionPaperSchema = new Schema(
  {
    id: { type: String, required: true },
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maximumMarks: { type: Number, required: true },
    generalInstruction: { type: String, required: true },
    introMessage: { type: String, required: true },
    sections: { type: [Schema.Types.Mixed], required: true },
    answerKey: { type: [Schema.Types.Mixed] },
  },
  { timestamps: true },
);

export const AssignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export const QuestionPaperModel =
  mongoose.models.QuestionPaper ||
  mongoose.model("QuestionPaper", questionPaperSchema);
