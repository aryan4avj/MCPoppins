import metadata from "../../package-metadata.json";

export type Risk = "R0 Read" | "R2 Write";

type SourceTool = { name: string; description: string; requiresApproval?: boolean };
type SourcePackage = {
  name: string;
  displayName: string;
  version: string;
  description: string;
  vendor: string;
  supportedEditions: string[];
  runtime: string;
  transports: string[];
  clients: string[];
  os: string[];
  installMethods: string[];
  defaultMode: string;
  readTools: SourceTool[];
  writeTools: SourceTool[];
  security: string[];
  prompts: string[];
};

export type ConnectorPackage = SourcePackage & {
  slug: "jira" | "confluence";
  system: string;
  mark: string;
  status: "Available";
  summary: string;
  longSummary: string;
  modes: string[];
  channels: string[];
  compatibility: string[];
  install: { label: string; command: string }[];
  tools: { name: string; description: string; risk: Risk }[];
  source: string;
  accent: string;
};

const accents = { jira: "#2457ff", confluence: "#6d4aff" } as const;
const marks = { jira: "JI", confluence: "CO" } as const;

export const platform = metadata.platform;

export const packages: ConnectorPackage[] = (metadata.packages as SourcePackage[]).map((item) => {
  const slug = item.name.includes("jira") ? "jira" : "confluence";
  const imageName = slug === "jira" ? "mcp-jira" : "mcp-confluence";
  return {
    ...item,
    slug,
    system: item.vendor,
    mark: marks[slug],
    status: "Available",
    summary: item.description,
    longSummary: item.description,
    modes: item.installMethods,
    channels: ["IDE", "Web Chat", "Microsoft Teams", "Slack"],
    compatibility: [...item.supportedEditions, item.runtime, ...item.os],
    install: [
      { label: "npm", command: `npm install ${item.name}` },
      { label: "ZIP", command: `Download and extract the reviewed ${imageName} release ZIP` },
      { label: "Docker", command: `docker build -t mcp-platform/${slug} ../packages/${imageName}` }
    ],
    tools: [
      ...item.readTools.map((tool) => ({ ...tool, risk: "R0 Read" as const })),
      ...item.writeTools.map((tool) => ({ ...tool, risk: "R2 Write" as const }))
    ],
    source: `packages/${imageName}`,
    accent: accents[slug]
  };
});

export const workflows = [
  {
    id: "thread-to-work",
    number: "01",
    title: "Thread → governed work",
    summary: "Read channel context, find related Jira and Confluence work, then show an exact write preview.",
    steps: ["Read invoked thread", "Find related work", "Cite the decision", "Draft Jira action", "Ask for approval"]
  },
  {
    id: "ambient-status",
    number: "02",
    title: "Ambient project status",
    summary: "Answer inside Slack, Teams or Web Chat through the existing gateway and the same permission boundary.",
    steps: ["Map channel identity", "Read allowed sources", "Resolve conflicts", "Return compact status", "Attach trace"]
  },
  {
    id: "knowledge-to-action",
    number: "03",
    title: "Knowledge → action",
    summary: "Connect a Confluence decision to Jira delivery state and prepare a controlled action.",
    steps: ["Search decision", "Inspect linked issues", "Explain blocker", "Prepare comment", "Request approval"]
  }
];

export function getPackage(slug: string) {
  return packages.find((item) => item.slug === slug);
}
