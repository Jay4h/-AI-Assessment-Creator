
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
  const apiUrl = process.env.API_URL ?? "http://localhost:4001";
  try {
    const res = await fetch(`${apiUrl}/api/assignments`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as AssignmentSummary[];
  } catch {
    return [];
  }
}
