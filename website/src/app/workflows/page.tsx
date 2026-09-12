import { workflows } from "@/data/catalog";

const examples = [
  { channel: "Slack", title: "Decision capture", prompt: "MCPoppins, turn the decision in this thread into tracked Jira work. Show the draft and sources first.", outcome: "A structured issue draft, linked decision and R2 approval card appear inside the thread." },
  { channel: "Teams", title: "Project pulse", prompt: "What is blocking launch this week? Reconcile Jira with the latest Confluence decision.", outcome: "A compact, source-linked status appears for the meeting without switching tabs." },
  { channel: "Telegram", title: "Field escalation", prompt: "Summarise new blockers since yesterday and prepare an escalation for the delivery lead.", outcome: "A mobile-safe briefing is generated; any notification remains approval-gated." }
];

export default function WorkflowsPage() {
  return (
    <>
      <section className="page-hero page-hero-workflows"><div className="shell"><span className="eyebrow">Workflow library</span><h1>Outcomes that begin inside the conversation.</h1><p>Reusable workflows join channel context, governed MCP tools and visible approval steps. The channel changes; the capability contract does not.</p></div></section>
      <section className="section shell"><div className="workflow-detail-grid">{workflows.map((flow) => <article key={flow.id}><span className="workflow-number">{flow.number}</span><h2>{flow.title}</h2><p>{flow.summary}</p><ol>{flow.steps.map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol><button className="button button-ghost">Preview workflow</button></article>)}</div></section>
      <section className="section section-soft"><div className="shell"><div className="section-heading"><span className="eyebrow">Example prompts</span><h2>Same intent. Native presentation.</h2><p>These are seeded competition examples, not connected integrations.</p></div><div className="example-grid">{examples.map((item) => <article key={item.channel}><div><span className="status-pill status-preview">{item.channel}</span><strong>{item.title}</strong></div><blockquote>“{item.prompt}”</blockquote><p>{item.outcome}</p></article>)}</div></div></section>
      <section className="section shell demo-script"><span className="eyebrow">90-second judge script</span><h2>Knowledge → action → same capability elsewhere.</h2><div className="script-grid"><article><span>00:00</span><strong>Start in Slack</strong><p>Invoke MCPoppins in a launch thread where a blocker and decision already exist.</p></article><article><span>00:25</span><strong>Ground the answer</strong><p>Show Confluence decision and linked Jira issue with citations and conflict handling.</p></article><article><span>00:50</span><strong>Preview the effect</strong><p>Generate an OpenUI approval card for the exact Jira comment—no write yet.</p></article><article><span>01:15</span><strong>Change the surface</strong><p>Ask the same workflow in Teams to prove the governed core is portable.</p></article></div></section>
    </>
  );
}
