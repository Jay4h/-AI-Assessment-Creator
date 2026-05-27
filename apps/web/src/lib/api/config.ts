/** Server-only API base URL (Express). */
export function getServerApiUrl(): string {
  return process.env.API_URL ?? "http://localhost:4001";
}
