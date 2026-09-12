import { randomUUID } from "node:crypto";

export function createJiraTools(config) {
  const { baseUrl, pat, email, projectKey, enableWrites, timeout = 30000, maxResults = 25 } = config;
  function auth() { if (email) return `Basic ${Buffer.from(`${email}:${pat}`).toString("base64")}`; return `Bearer ${pat}`; }

  async function req(path, opts = {}) {
    const c = new AbortController(); const t = setTimeout(() => c.abort(), timeout);
    try {
      const r = await fetch(`${baseUrl}/rest/api/2${path}`, { ...opts, signal: c.signal, headers: { Authorization: auth(), "Content-Type": "application/json", Accept: "application/json", "X-Request-ID": randomUUID(), ...opts.headers } });
      if (!r.ok) { const s = r.status; if (s === 401) throw new Error("Auth failed (401)."); if (s === 403) throw new Error("Denied (403)."); if (s === 404) throw new Error("Not found (404)."); throw new Error(`Jira ${s}`); }
      return r.status === 204 ? null : r.json();
    } catch (e) { if (e.name === "AbortError") throw new Error("Timeout."); throw e; } finally { clearTimeout(t); }
  }

  return {
    jira_health_check: { description: "Check Jira connection", connector: "jira", mode: "read", handler: async () => { const me = await req("/myself"); return `Connected as ${me.displayName} to ${baseUrl}. Mode: ${enableWrites ? "rw" : "ro"}.`; } },
    jira_whoami: { description: "Current Jira user", connector: "jira", mode: "read", handler: async () => { const d = await req("/myself"); return `${d.displayName} (${d.name || d.accountId})\n${d.emailAddress || ""}`; } },
    jira_my_issues: { description: "Your open issues", connector: "jira", mode: "read", handler: async () => { let jql = "assignee=currentUser() AND status!=Done ORDER BY updated DESC"; if (projectKey) jql = `project=${projectKey} AND ${jql}`; const d = await req(`/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=summary,status,priority`); if (!d.issues?.length) return "No open issues."; return d.issues.map(i => `${i.key}: ${i.fields.summary} [${i.fields.status?.name}]`).join("\n"); } },
    jira_get_issue: { description: "Get issue details", connector: "jira", mode: "read", parameters: { issueKey: "string" }, handler: async ({ issueKey }) => { if (!issueKey) return "Provide an issue key."; const d = await req(`/issue/${encodeURIComponent(issueKey)}`); const f = d.fields; return `${issueKey}: ${f.summary}\nStatus: ${f.status?.name}\nPriority: ${f.priority?.name}\nAssignee: ${f.assignee?.displayName || "Unassigned"}\n${baseUrl}/browse/${issueKey}`; } },
    jira_search: { description: "JQL search", connector: "jira", mode: "read", parameters: { jql: "string" }, handler: async ({ jql }) => { if (!jql) return "Provide JQL."; const d = await req(`/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=summary,status,priority`); if (!d.issues?.length) return "No issues."; return `${d.total} found:\n` + d.issues.map(i => `${i.key}: ${i.fields.summary} [${i.fields.status?.name}]`).join("\n"); } },
  };
}
