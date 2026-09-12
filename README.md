# MCP Platform

> Connect your work tools to every AI workspace, safely.

A secure MCP connector marketplace and omnichannel agent gateway. Install trusted MCP kits for Jira and Confluence, run them locally or through a governed gateway, and use the same capabilities from your IDE, website and collaboration channels.

---

## What's Inside

| Package | Tools | Description |
|---------|-------|-------------|
| [@mcp-platform/jira](./packages/mcp-jira/) | 17 | Jira Cloud & Data Center — issues, sprints, boards, comments, attachments, worklogs |
| [@mcp-platform/confluence](./packages/mcp-confluence/) | 14 | Confluence Cloud & Data Center — pages, search, labels, attachments, version history |

Both packages are **read-only by default**. Write operations require explicit enablement.

---

## Quick Start — For Users

### 1. Prerequisites
- **Node.js 18+** — [download](https://nodejs.org/)
- Access to a Jira or Confluence instance
- API token (Cloud) or Personal Access Token (Data Center)

### 2. Install

```bash
git clone <repo-url>
cd mcp-platform

cd packages/mcp-jira
npm install
```

### 3. Configure

```bash
cp .env.example .env
# Edit .env with your instance URL and token
```

### 4. Verify

```bash
npm run doctor
```

### 5. Connect to Your IDE

#### Kiro IDE
Create `.kiro/settings/mcp.json`:
```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["C:/path/to/mcp-platform/packages/mcp-jira/src/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://your-domain.atlassian.net",
        "JIRA_PAT": "YOUR_TOKEN_HERE",
        "JIRA_EMAIL": "you@example.com"
      }
    },
    "confluence": {
      "command": "node",
      "args": ["C:/path/to/mcp-platform/packages/mcp-confluence/src/index.js"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://your-domain.atlassian.net/wiki",
        "CONFLUENCE_PAT": "YOUR_TOKEN_HERE",
        "CONFLUENCE_EMAIL": "you@example.com"
      }
    }
  }
}
```

#### VS Code / Claude Desktop / GitLab Duo
Same JSON format in your IDE's MCP config location.

### 6. Start Using
- "Show me my open Jira issues"
- "What's the status of PROJ-123?"
- "Find the Confluence page about deployment"
- "Show the sprint board for project PROJ"

---

## Quick Start — For Team Members (Website / FE)

Your work is independent of the backend packages:

1. **Read the handbook** — Sections 3, 8, 9, 14, 19
2. **Use `website/package-metadata.json`** for structured package data
3. **Build with static/placeholder data** — don't wait for backend APIs
4. **Pages to build:** Home, Marketplace, Package Detail, Docs, Trust Centre, Pricing

Homepage headline: **"Connect your work tools to every AI workspace, safely."**

---

## Tools

### Jira (17)

| Tool | Description | Mode |
|------|-------------|------|
| health_check | Validate connection | Read |
| get_issue | Issue details by key | Read |
| search_issues | JQL search | Read |
| my_issues | Your open issues | Read |
| get_board_issues | Board issues | Read |
| get_sprint_issues | Agile sprint view | Read |
| get_attachments | Issue attachments | Read |
| get_worklogs | Work logs | Read |
| get_comments | Issue comments | Read |
| get_links | Linked issues | Read |
| whoami | Current user | Read |
| create_issue | Create issue | Write |
| update_issue | Update fields | Write |
| transition_issue | Change status | Write |
| add_comment | Add comment | Write |
| assign_issue | Assign user | Write |
| log_work | Log time | Write |

### Confluence (14)

| Tool | Description | Mode |
|------|-------------|------|
| health_check | Validate connection | Read |
| get_page | Page by ID | Read |
| get_page_by_title | Page by title | Read |
| search_pages | CQL search | Read |
| search_pages_advanced | Paginated search | Read |
| list_child_pages | Page tree | Read |
| get_page_raw | Raw XHTML | Read |
| get_page_metadata | JSON metadata + labels | Read |
| get_attachments | Page attachments | Read |
| get_labels | Page labels | Read |
| get_page_history | Version history | Read |
| create_page | Create page | Write |
| update_page | Update page | Write |

---

## Configuration

### Jira
| Variable | Required | Default |
|----------|----------|---------|
| JIRA_BASE_URL | Yes | — |
| JIRA_PAT | Yes | — |
| JIRA_EMAIL | Cloud | — |
| JIRA_PROJECT_KEY | No | — |
| JIRA_ENABLE_WRITES | No | false |
| JIRA_ALLOWED_PROJECTS | No | — |
| JIRA_REQUEST_TIMEOUT | No | 30000 |
| JIRA_MAX_RESULTS | No | 25 |

### Confluence
| Variable | Required | Default |
|----------|----------|---------|
| CONFLUENCE_BASE_URL | Yes | — |
| CONFLUENCE_PAT | Yes | — |
| CONFLUENCE_EMAIL | Cloud | — |
| CONFLUENCE_ENABLE_WRITES | No | false |
| CONFLUENCE_REQUEST_TIMEOUT | No | 30000 |
| CONFLUENCE_MAX_RESULTS | No | 25 |

---

## Docker

```bash
cp docker-compose.example.yml docker-compose.yml
# Edit with your credentials
docker compose up --build
```

---

## Security

- Read-only by default
- No TLS bypass — use NODE_EXTRA_CA_CERTS for corporate certs
- No embedded credentials
- Project allowlist (Jira)
- Safe CQL escaping (Confluence)
- Request timeouts with AbortController
- Correlation IDs on every request
- Non-root Docker containers

---

## Supported Platforms

**Works today:** Kiro IDE, VS Code, GitLab Duo, Claude Desktop, Cursor, Windsurf, any MCP client

**Planned:** Website chat, Microsoft Teams, Slack, WhatsApp, Discord, Telegram

---

## Tests

```bash
cd packages/mcp-jira && npm test
cd packages/mcp-confluence && npm test
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "BASE_URL is required" | Set URL in .env or mcp.json |
| "Authentication failed (401)" | Regenerate token |
| "Permission denied (403)" | Check API access |
| "Request timed out" | Check network or increase timeout |
| SSL errors | Set NODE_EXTRA_CA_CERTS |
| "Cannot find module" | Run npm install |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licence

Subject to legal approval. See each package's LICENSE file.
