import type { Request as ExpressRequest } from "express";

// Bridges an Express request into a Fetch API Request, which @clerk/backend expects. Pass `body` only for the raw-body webhook route.
export function toFetchRequest(req: ExpressRequest, body?: Buffer): Request {
  const host = req.get("host") ?? "localhost";
  const url = `${req.protocol}://${host}${req.originalUrl}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, value);
    }
  }

  const canHaveBody = body !== undefined && req.method !== "GET" && req.method !== "HEAD";

  return new Request(url, {
    method: req.method,
    headers,
    ...(canHaveBody ? { body } : {}),
  });
}
