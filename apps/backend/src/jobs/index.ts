export type JobResult = {
  ok: true;
  job: string;
  status: "skipped";
  reason: string;
};

export async function runDailyReportJob(): Promise<JobResult> {
  return { ok: true, job: "daily-report", status: "skipped", reason: "not_enabled" };
}

export async function runReviewMonitoringJob(): Promise<JobResult> {
  return { ok: true, job: "review-monitoring", status: "skipped", reason: "not_enabled" };
}

export async function runBillingReminderJob(): Promise<JobResult> {
  return { ok: true, job: "billing-reminder", status: "skipped", reason: "stripe_deferred" };
}
