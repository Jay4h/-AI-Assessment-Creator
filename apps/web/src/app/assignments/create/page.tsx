import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard-shell";
import { AssignmentForm } from "@/components/assignment-form";

export const metadata: Metadata = {
  title: "Create Assignment",
  description: "Set up a new assignment with question types, marks, and due date.",
};

export default function CreateAssignmentPage() {
  return (
    <DashboardShell breadcrumb="Assignment" backHref="/assignments">
      <AssignmentForm />
    </DashboardShell>
  );
}
