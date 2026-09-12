import { randomUUID } from "node:crypto";

export function createConfluenceTools(config) {
  const { baseUrl, pat, email, enableWrites, timeout = 30000, maxResults = 25 } = config;
  function auth() { if (email) return `Basic ${Buffer.from(`${email}:${pat}`).toString("base64")}`; return `Bearer ${pat}`; }
  function esc(s) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

  async function req(path, opts = {}) {
    const c = new AbortController(); const t = setTimeout(() => c.abort(), timeout);
    try {
      const r = await fetch(`${baseUrl}/rest/api${path}`, { ...opts, signal: c.signal, headers: { Authorization: auth(), "Content-Type": "application/json", Accept: "application/json", "X-Request-ID": randomUUID(), ...opts.headers } });
      if (!r.ok) { const s = r.status; if (s === 401) throw new Error("Auth failed."); if (s === 403) throw new Error("Denied."); if (s === 404) throw new Error("Not found."); throw new Error(`Confluence ${s}`); }
      return r.json();
    } catch (e) { if (e.name === "AbortError") throw new Error("Timeout."); throw e; } finally { clearTimeout(t); }
  }

  function strip(h) { return (h || "").replace(/<[^>]*>/g, ""); }

  return {
    confluence_health_check: { description: "Check Confluence connection", connector: "confluence", mode: "read", handler: async () => { const d = await req("/space?limit=1"); return `Connected to ${baseUrl}. Spaces: ${d.results?.length || "?"}. Mode: ${enableWrites ? "rw" : "ro"}.`; } },
    confluence_search: { description: "Search pages", connector: "confluence", mode: "read", parameters: { query: "string", spaceKey: "string?" }, handler: async ({ query, spaceKey }) => { if (!query) return "Provide a query."; let cql = `text ~ "${esc(query)}"`; if (spaceKey) cql += ` AND space = "${esc(spaceKey)}"`; const d = await req(`/content/search?cql=${encodeURIComponent(cql)}&limit=${maxResults}&expand=space`); if (!d.results?.length) return "No results."; return d.results.map(p => `${p.title} (${p.id}, ${p.space?.key})`).join("\n"); } },
    confluence_get_page: { description: "Get page by ID", connector: "confluence", mode: "read", parameters: { pageId: "string" }, handler: async ({ pageId }) => { if (!pageId) return "Provide page ID."; const d = await req(`/content/${pageId}?expand=body.storage,version,space`); return `${d.title} (v${d.version?.number})\n\n${strip(d.body?.storage?.value || "").slice(0, 2000)}`; } },
  };
}
