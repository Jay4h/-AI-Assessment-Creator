"use server";

export interface AssignmentStatus {
  id: string;
  status: string;
  questionPaperId: string | null;
}

/**
 * Fetches the current status of a single assignment from the API.
 * Used by OutputClient on mount to detect if the worker already finished
 * before the Socket.IO connection was established (race-condition guard).
 */
export async function fetchAssignmentStatus(
  assignmentId: string,
): Promise<AssignmentStatus | null> {
  const apiUrl = process.env.API_URL ?? "http://localhost:4001";
  try {
    const res = await fetch(
      `${apiUrl}/api/assignments/${assignmentId}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      status: data.status,
      questionPaperId: data.questionPaperId ?? null,
    };
  } catch {
    return null;
  }
}
