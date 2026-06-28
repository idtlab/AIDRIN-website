export const accessModes = [
  { name: "Web Inspector",   icon: "browser",  blurb: "Upload and assess datasets in your browser. No setup." },
  { name: "Python Library",  icon: "package",  blurb: "pip install and score datasets in scripts and notebooks." },
  { name: "CLI",             icon: "terminal", blurb: "Headless command-line evaluation, scriptable and CI-friendly.", agentic: true },
  { name: "MCP Server",      icon: "plug",     blurb: "Expose AIDRIN to AI agents via the Model Context Protocol.", agentic: true },
  { name: "Globus Remote Compute", icon: "cloud", blurb: "Run metrics on remote datasets without transferring files." },
  { name: "LLM Explanations", icon: "chat",    blurb: "Generate plain-language explanations of metric results." },
];
