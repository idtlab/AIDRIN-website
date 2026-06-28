// Six core readiness dimensions, color-coded along the readiness spectrum
// (coral → magenta → blue). "AI Application-Specific" is a seventh,
// cross-cutting dimension evaluated across all six (see crossCutting below).
export const dimensions = [
  { title: "Data Quality",                 icon: "quality",     color: "#E96A50", blurb: "Completeness, outliers, duplicates, and overall integrity." },
  { title: "Data Governance",              icon: "governance",  color: "#D8638A", blurb: "Privacy, sensitivity, and responsible-use signals." },
  { title: "Understandability & Usability", icon: "usability",   color: "#C45FA6", blurb: "Documentation, metadata, and ease of reuse." },
  { title: "Fairness & Bias",              icon: "fairness",    color: "#A85FBE", blurb: "Class imbalance and representation across groups." },
  { title: "Impact on AI",                 icon: "impact",      color: "#7C6BD4", blurb: "Feature relevance and correlation that shape model outcomes." },
  { title: "Structure & Organization",     icon: "structure",   color: "#4F86E8", blurb: "Schema, formats, and structural consistency." },
];

export const crossCutting = {
  title: "AI Application-Specific",
  icon: "aiapp",
  blurb: "Readiness judged against the needs of your specific AI application, cutting across all six dimensions rather than standing apart from them.",
};
