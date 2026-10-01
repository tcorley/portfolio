import { createRequestHandler } from "react-router";
import { handleMetricsBeacon, writeMetric } from "./metrics";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

const RESUME_PATH = "/resume.pdf";
const METRICS_PATH = "/api/metrics";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === METRICS_PATH) {
      return handleMetricsBeacon(request, env);
    }

    if (url.pathname === RESUME_PATH) {
      // Count document opens only (GET). HEAD still needs ASSETS so the PDF
      // is discoverable under run_worker_first (asset-first no longer applies).
      if (request.method === "GET") {
        writeMetric(env, request, {
          eventType: "resume_open",
          target: RESUME_PATH,
          linkId: "",
        });
      }

      if (
        env.ASSETS &&
        (request.method === "GET" || request.method === "HEAD")
      ) {
        return env.ASSETS.fetch(request);
      }
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
