export type Difficulty = "easy" | "moderate" | "medium" | "hard" | "challenging";

export type QuestionType =
  | "multiple_choice"
  | "short"
  | "diagram"
  | "numerical";

export interface QuestionTypeRow {
  id: string;
  type: QuestionType;
  label: string;
  count: number;
  marksPerQuestion: number;
}

export interface AssignmentDraft {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  fileName?: string;
  questionTypes: QuestionTypeRow[];
  additionalInstructions: string;
}

export interface QuestionPaperQuestion {
  id: string;
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
  options?: string[]; // MCQ only — A), B), C), D)
}

export interface QuestionPaperSection {
  id: string;
  title: string;
  /** e.g. "Short Answer Questions", "Multiple Choice Questions" */
  typeLabel?: string;
  instruction: string;
  questions: QuestionPaperQuestion[];
}

export interface QuestionPaper {
  id: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstruction: string;
  introMessage: string;
  sections: QuestionPaperSection[];
  answerKey?: { number: number; sectionId?: string; answer: string }[];
}

export type GenerationJobStatus =
  | "queued"
  | "processing"
  | "generating_section_A"
  | "generating_section_B"
  | "completed"
  | "failed";

export interface CreateAssignmentInput {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  additionalInstructions?: string;
  questionTypes: QuestionTypeRow[];
}

export interface AssignmentRecord extends CreateAssignmentInput {
  id: string;
  status: GenerationJobStatus;
  questionPaperId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationProgressEvent {
  assignmentId: string;
  status: GenerationJobStatus;
  message: string;
  progress: number;
  timestamp: string;
}
