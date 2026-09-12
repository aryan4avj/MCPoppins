import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { createJiraTools } from "./connectors/jira.js";
import { createConfluenceTools } from "./connectors/confluence.js";

const PORT = process.env.PORT || 3000;
const SECRET = process.env.GATEWAY_SECRET || "";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// --- Tool registry ---
const tools = {};

if (process.env.JIRA_BASE_URL && process.env.JIRA_PAT) {
  const t = createJiraTools({ baseUrl: process.env.JIRA_BASE_URL, pat: process.env.JIRA_PAT, email: process.env.JIRA_EMAIL, projectKey: process.env.JIRA_PROJECT_KEY || "", enableWrites: process.env.JIRA_ENABLE_WRITES === "true", timeout: 30000, maxResults: 25 });
  Object.assign(tools, t);
  console.log(`[gateway] Jira: ${Object.keys(t).length} tools`);
}

if (process.env.CONFLUENCE_BASE_URL && process.env.CONFLUENCE_PAT) {
  const t = createConfluenceTools({ baseUrl: process.env.CONFLUENCE_BASE_URL, pat: process.env.CONFLUENCE_PAT, email: process.env.CONFLUENCE_EMAIL, enableWrites: process.env.CONFLUENCE_ENABLE_WRITES === "true", timeout: 30000, maxResults: 25 });
  Object.assign(tools, t);
  console.log(`[gateway] Confluence: ${Object.keys(t).length} tools`);
}

// --- Auth ---
function auth(req, res, next) { if (!SECRET) return next(); if (req.headers.authorization?.replace("Bearer ", "") !== SECRET) return res.status(401).json({ error: "Unauthorized" }); next(); }

// --- Routes ---
app.get("/health", (_, res) => res.json({ status: "ok", tools: Object.keys(tools).length, jira: !!process.env.JIRA_BASE_URL, confluence: !!process.env.CONFLUENCE_BASE_URL }));

app.get("/tools", auth, (_, res) => res.json({ tools: Object.entries(tools).map(([n, t]) => ({ name: n, description: t.description, connector: t.connector, mode: t.mode })), total: Object.keys(tools).length }));

app.post("/tools/:name", auth, async (req, res) => {
  const id = randomUUID(); const t = tools[req.params.name];
  if (!t) return res.status(404).json({ error: "Tool not found", id });
  try { const r = await t.handler(req.body || {}); res.json({ result: r, id, tool: req.params.name }); }
  catch (e) { res.status(500).json({ error: e.message, id }); }
});

app.post("/chat", auth, async (req, res) => {
  const { message, channel, userId } = req.body; const id = randomUUID();
  if (!message) return res.status(400).json({ error: "message required", id });
  const r = { id, channel: channel || "api", userId: userId || "anon", message, toolsCalled: [], reply: "" };
  try {
    const l = message.toLowerCase();
    if (tools.jira_my_issues && (l.includes("my issues") || l.includes("my tickets"))) { r.reply = await tools.jira_my_issues.handler({}); r.toolsCalled.push("jira_my_issues"); }
    else if (tools.jira_whoami && (l.includes("who am i") || l.includes("whoami"))) { r.reply = await tools.jira_whoami.handler({}); r.toolsCalled.push("jira_whoami"); }
    else if (tools.jira_health_check && l.includes("jira") && l.includes("health")) { r.reply = await tools.jira_health_check.handler({}); r.toolsCalled.push("jira_health_check"); }
    else if (tools.confluence_health_check && l.includes("confluence") && l.includes("health")) { r.reply = await tools.confluence_health_check.handler({}); r.toolsCalled.push("confluence_health_check"); }
    else { r.reply = `Try: "show my issues", "who am I", "check Jira health". Tools: ${Object.keys(tools).join(", ")}`; }
    res.json(r);
  } catch (e) { r.error = e.message; res.status(500).json(r); }
});

// Teams webhook
app.post("/webhooks/teams", async (req, res) => {
  const text = req.body?.text?.replace(/<[^>]*>/g, "").trim() || "";
  if (!text) return res.json({ type: "message", text: "Send a message to get started." });
  try {
    const cr = await fetch(`http://localhost:${PORT}/chat`, { method: "POST", headers: { "Content-Type": "application/json", ...(SECRET ? { Authorization: `Bearer ${SECRET}` } : {}) }, body: JSON.stringify({ message: text, channel: "teams", userId: req.body?.from?.id }) });
    const d = await cr.json(); res.json({ type: "message", text: d.reply || d.error || "No response." });
  } catch (e) { res.json({ type: "message", text: `Error: ${e.message}` }); }
});

// Slack webhook
app.post("/webhooks/slack", async (req, res) => {
  if (req.body.type === "url_verification") return res.json({ challenge: req.body.challenge });
  const ev = req.body.event; if (!ev || ev.type !== "message" || ev.bot_id) return res.sendStatus(200);
  try {
    const cr = await fetch(`http://localhost:${PORT}/chat`, { method: "POST", headers: { "Content-Type": "application/json", ...(SECRET ? { Authorization: `Bearer ${SECRET}` } : {}) }, body: JSON.stringify({ message: ev.text, channel: "slack", userId: ev.user }) });
    const d = await cr.json();
    if (process.env.SLACK_BOT_TOKEN && d.reply) await fetch("https://slack.com/api/chat.postMessage", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` }, body: JSON.stringify({ channel: ev.channel, text: d.reply }) });
  } catch (e) { console.error(`[slack] ${e.message}`); }
  res.sendStatus(200);
});

app.listen(PORT, () => { console.log(`\n=== MCP Gateway ===\nhttp://localhost:${PORT}\nTools: ${Object.keys(tools).length}\n`); });
