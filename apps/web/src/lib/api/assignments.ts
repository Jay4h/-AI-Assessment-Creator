import { getServerApiUrl } from "./config";

export interface AssignmentSummary {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  status: string;
  createdAt: string;
}

export async function fetchAssignments(): Promise<AssignmentSummary[]> {
  try {
    const res = await fetch(`${getServerApiUrl()}/api/assignments`, {
      next: { revalidate: 30, tags: ["assignments"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as AssignmentSummary[];
  } catch {
    return [];
  }
}
