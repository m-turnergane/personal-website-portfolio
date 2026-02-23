export const SUBSCRIBE_CATEGORIES = [
  { id: "writing", label: "Writing" },
  { id: "trading-lab", label: "Trading Lab" },
  { id: "automation", label: "Automation" },
  { id: "projects", label: "Deployed Projects" },
] as const;

export type CategoryId = (typeof SUBSCRIBE_CATEGORIES)[number]["id"];

export const VALID_CATEGORY_IDS: string[] = SUBSCRIBE_CATEGORIES.map(
  (c) => c.id
);

export const COLLECTION_TO_CATEGORY: Record<string, CategoryId> = {
  writing: "writing",
  trading: "trading-lab",
  automation: "automation",
  projects: "projects",
};

export const CATEGORY_LABELS: Record<string, string> = {
  writing: "Writing",
  "trading-lab": "Trading Lab",
  automation: "Automation",
  projects: "Deployed Projects",
};
