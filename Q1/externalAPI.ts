export type PatientRecord = { record_id: string } & Record<string, string>;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const PERMISSION_ERROR = "You do not have permission to use the api";

export async function fetchPatientRecords(
  url: string,
  token: string,
  timeoutMs = 45_000,
): Promise<PatientRecord[]> {
  const body = new URLSearchParams({ token: token, content: "record", format: "json" });

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    throw new ApiError(timedOut ? `Request timed out after ${timeoutMs} ms` : `Network error: ${(err as Error).message}`);
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = undefined;
  }
  const serverMsg =
    data && typeof data === "object" && !Array.isArray(data) && "error" in data
      ? String((data as { error: unknown }).error)
      : "";

  if (!res.ok) {
    const message = serverMsg || (res.status === 401 || res.status === 403 ? PERMISSION_ERROR : text.slice(0, 200));
    throw new ApiError(`HTTP ${res.status}: ${message}`, res.status);
  }

  if (serverMsg) throw new ApiError(`API error: ${serverMsg}`, res.status);

  return data as PatientRecord[];
}


