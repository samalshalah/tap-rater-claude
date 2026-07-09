import { createServer } from "node:http";
import { jsonBody, healthPayload, isCronAuthorized } from "./http.js";
import { runBillingReminderJob, runDailyReportJob, runReviewMonitoringJob } from "./jobs/index.js";

const port = Number(process.env.PORT || 3001);

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://localhost");

  response.setHeader("content-type", "application/json; charset=utf-8");

  if (request.method === "GET" && url.pathname === "/healthz") {
    response.statusCode = 200;
    response.end(jsonBody(healthPayload()));
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/jobs/")) {
    if (!process.env.CRON_SECRET) {
      response.statusCode = 503;
      response.end(jsonBody({ ok: false, error: "CRON_SECRET is not configured" }));
      return;
    }

    if (!isCronAuthorized(request.headers.authorization, process.env.CRON_SECRET)) {
      response.statusCode = 401;
      response.end(jsonBody({ ok: false, error: "Unauthorized" }));
      return;
    }

    if (url.pathname === "/jobs/daily-report") {
      response.statusCode = 200;
      response.end(jsonBody(await runDailyReportJob()));
      return;
    }

    if (url.pathname === "/jobs/review-monitoring") {
      response.statusCode = 200;
      response.end(jsonBody(await runReviewMonitoringJob()));
      return;
    }

    if (url.pathname === "/jobs/billing-reminder") {
      response.statusCode = 200;
      response.end(jsonBody(await runBillingReminderJob()));
      return;
    }
  }

  response.statusCode = 404;
  response.end(jsonBody({ ok: false, error: "Not found" }));
});

server.listen(port, () => {
  console.log(`Tap Rater backend listening on ${port}`);
});
