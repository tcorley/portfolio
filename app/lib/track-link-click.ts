/**
 * Fire-and-forget click beacon for outbound (and resume) social links.
 * Does not block navigation; prefers sendBeacon, falls back to keepalive fetch.
 */

export type TrackableLinkId = "resume" | "github" | "linkedin" | "bluesky";

export function trackLinkClick(linkId: TrackableLinkId, href: string): void {
  const payload = JSON.stringify({
    event: "link_click",
    linkId,
    href,
  });

  try {
    const blob = new Blob([payload], { type: "application/json" });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const queued = navigator.sendBeacon("/api/metrics", blob);
      if (queued) return;
    }

    void fetch("/api/metrics", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    });
  } catch {
    // Metrics must never break navigation.
  }
}
