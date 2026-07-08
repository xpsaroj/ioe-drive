import type { Request as ExpressRequest } from "express";

/**
 * Bridges an Express request into a standard Fetch API Request - what @clerk/backend's
 * authenticateRequest()/verifyWebhook() expect (Clerk's SDK is framework-agnostic,
 * built on the Fetch API rather than Node's IncomingMessage).
 *
 * `body` is only meaningful (and only allowed by the Fetch Request constructor) for
 * methods other than GET/HEAD - pass it for the raw-body webhook route, omit it for
 * the auth guard (Clerk only needs headers/cookies to authenticate a request).
 */
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
