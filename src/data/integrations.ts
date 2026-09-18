// `logo` points to a file in /public/logos (omit when we only have a wordmark).
export const extensions = [
  { name: "Agentic Evaluation", icon: "sparkle", blurb: "Let an AI agent inspect, fix, and report via the CLI or MCP server." },
  { name: "Custom Metrics",     icon: "structure", blurb: "Define your own metrics and remedies through an extensible framework." },
];

export const integrations = [
  { name: "MLflow",             icon: "impact", logo: "/logos/mlflow.svg", blurb: "Log readiness metrics and reports to MLflow runs alongside your experiments." },
  { name: "OpenTelemetry",      icon: "impact", logo: "/logos/opentelemetry.svg", blurb: "Emit traces and metrics for observability into evaluation runs with OpenTelemetry support." },
  { name: "APPFL",              icon: "governance", logo: "/logos/appfl.png", blurb: "Assess data readiness inside privacy-preserving federated learning workflows." },
];
