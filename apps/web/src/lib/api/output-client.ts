import type { QuestionPaper } from "@vedaai/types";
import { getClientApiUrl } from "./config";

/** Client-side fetch to Express API (avoids Server Action round-trips). */
export async function fetchAssignmentOutputClient(
  assignmentId: string,
): Promise<{ status: string; output: QuestionPaper | null }> {
  try {
    const res = await fetch(
      `${getClientApiUrl()}/api/assignments/${assignmentId}/output`,
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
