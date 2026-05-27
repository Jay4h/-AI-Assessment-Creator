"use server";

import type { QuestionPaper } from "@vedaai/types";
import { getServerApiUrl } from "./config";

export async function fetchAssignmentOutput(
  assignmentId: string,
): Promise<{ status: string; output: QuestionPaper | null }> {
  try {
    const res = await fetch(
      `${getServerApiUrl()}/api/assignments/${assignmentId}/output`,
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
