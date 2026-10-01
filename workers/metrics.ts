/**
 * Privacy-light portfolio metrics via Workers Analytics Engine.
 *
 * Event schema (ordered; keep stable for SQL aliases):
 *   blob1  event_type   — "resume_open" | "link_click"
 *   blob2  target       — path ("/resume.pdf") or outbound href
 *   blob3  link_id      — allowlisted id ("resume"|"github"|"linkedin"|"bluesky") or ""
 *   blob4  country      — CF colo country (ISO-3166-1 alpha-2) or "XX"
 *   double1 count       — always 1
 *   index1  hostname    — request host (sampling key)
 */

export const ALLOWED_LINK_IDS = [
  "resume",
  "github",
  "linkedin",
  "bluesky",
] as const;

export type LinkId = (typeof ALLOWED_LINK_IDS)[number];
export type MetricEventType = "resume_open" | "link_click";

export type MetricEvent = {
  eventType: MetricEventType;
  target: string;
  linkId: LinkId | "";
};

function isAllowedLinkId(value: string): value is LinkId {
  return (ALLOWED_LINK_IDS as readonly string[]).includes(value);
}

function countryFromRequest(request: Request): string {
  const country = request.headers.get("cf-ipcountry");
  if (!country || country.length > 3) return "XX";
  return country.toUpperCase();
}

export function writeMetric(
  env: Env,
  request: Request,
  event: MetricEvent
): void {
  if (!env.METRICS) return;

  const hostname = new URL(request.url).hostname || "unknown";
  const target = event.target.slice(0, 512);
  const linkId = event.linkId.slice(0, 64);

  env.METRICS.writeDataPoint({
    blobs: [event.eventType, target, linkId, countryFromRequest(request)],
    doubles: [1],
    indexes: [hostname],
  });
}

type BeaconBody = {
  event?: unknown;
  linkId?: unknown;
  href?: unknown;
};

export async function handleMetricsBeacon(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: "POST, OPTIONS",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: BeaconBody;
  try {
    body = (await request.json()) as BeaconBody;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  if (body.event !== "link_click") {
    return new Response("Bad Request", { status: 400 });
  }

  if (typeof body.linkId !== "string" || !isAllowedLinkId(body.linkId)) {
    return new Response("Bad Request", { status: 400 });
  }

  if (typeof body.href !== "string" || body.href.length === 0) {
    return new Response("Bad Request", { status: 400 });
  }

  // Only allow absolute http(s) or same-origin relative paths — no javascript: etc.
  let target: string;
  try {
    const resolved = new URL(body.href, request.url);
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
      return new Response("Bad Request", { status: 400 });
    }
    target =
      resolved.origin === new URL(request.url).origin
        ? `${resolved.pathname}${resolved.search}`
        : resolved.href;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  writeMetric(env, request, {
    eventType: "link_click",
    target,
    linkId: body.linkId,
  });

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
