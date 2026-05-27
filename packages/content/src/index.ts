import assignmentsEmptyContentJson from "./pages/assignments-empty.json";
import createAssignmentContentJson from "./pages/create-assignment.json";

export type { ContentNode, PageContent, TextVariant } from "./render-nodes";
export { mockQuestionPaper } from "./mock-question-paper";
import type { PageContent } from "./render-nodes";

export const assignmentsEmptyContent =
  assignmentsEmptyContentJson as unknown as PageContent;
export const createAssignmentContent =
  createAssignmentContentJson as unknown as PageContent;

export const QUESTION_TYPE_OPTIONS = [
  { value: "multiple_choice", label: "Multiple Choice Questions" },
  { value: "short", label: "Short Questions" },
  { value: "diagram", label: "Diagram/Graph-Based Questions" },
  { value: "numerical", label: "Numerical Problems" },
] as const;

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/groups", label: "My Groups", icon: "users" },
  { href: "/assignments", label: "Assignments", icon: "file", active: true },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: "book" },
  { href: "/library", label: "My Library", icon: "library", badge: 32 },
] as const;
