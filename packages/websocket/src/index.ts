export const SOCKET_EVENTS = {
  status: "generation:status",
  assignmentRoom: (assignmentId: string) => `assignment:${assignmentId}`,
} as const;
