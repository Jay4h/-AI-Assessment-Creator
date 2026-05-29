/** Server-only API base URL (Express). */
export function getServerApiUrl(): string {
  return process.env.API_URL ?? "http://localhost:4001";
}

/** Browser / client API base URL (Socket.IO + client fetch). */
export function getClientApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";
}
