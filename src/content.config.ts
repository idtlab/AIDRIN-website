import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    url: z.string().optional(),
    bibtex: z.string().optional(),
  }),
});
const useCases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/use-cases" }),
  schema: z.object({ title: z.string(), domain: z.string(), summary: z.string(), draft: z.boolean().default(true) }),
});
const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({ name: z.string(), role: z.string(), affiliation: z.string().optional(), draft: z.boolean().default(true) }),
});
export const collections = { publications, useCases, team };
