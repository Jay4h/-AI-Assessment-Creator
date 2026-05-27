import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard-shell";
import { OutputClient } from "@/components/output-client";

export const metadata: Metadata = {
  title: "Question Paper",
  description: "View your AI-generated structured question paper.",
};

export default async function AssignmentOutputPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardShell breadcrumb="Create New" backHref="/assignments/create">
      <div className="px-1 py-4 sm:px-0">
        <OutputClient assignmentId={id} />
      </div>
    </DashboardShell>
  );
}
