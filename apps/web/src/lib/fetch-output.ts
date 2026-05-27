"use server";

import type { QuestionPaper } from "@vedaai/types";

export async function fetchAssignmentOutput(
  assignmentId: string,
): Promise<{ status: string; output: QuestionPaper | null }> {
  const apiUrl = process.env.API_URL ?? "http://localhost:4001";
  try {
    const res = await fetch(
      `${apiUrl}/api/assignments/${assignmentId}/output`,
      // no-store so this is always fresh; this action is only called after a
      // "completed" socket event so there's no stale-cache risk.
      { cache: "no-store" },
    );

    if (!res.ok) {
      return { status: "failed", output: null };
    }

    const data = await res.json();
    return { status: data.status, output: data.output ?? null };
  } catch {
    return { status: "failed", output: null };
  }
}
