# MCP Gateway

> HTTP server that exposes Jira and Confluence MCP tools to web chat, Microsoft Teams, Slack and other channels.

## Quick Start

```bash
cd apps/gateway
npm install
cp .env.example .env    # Add your Jira/Confluence credentials
node src/index.js
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/tools` | List all available tools |
| POST | `/tools/:name` | Execute a tool by name |
| POST | `/chat` | Natural language message routing |
| POST | `/webhooks/teams` | Microsoft Teams webhook |
| POST | `/webhooks/slack` | Slack Events API webhook |

## Test It

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tools
curl -X POST http://localhost:3000/chat -H "Content-Type: application/json" -d "{\"message\": \"show my issues\"}"
```

## Channel Setup Guides

- [Teams Setup](../../docs/channels/teams-setup.md)
- [Slack Setup](../../docs/channels/slack-setup.md)
- [Web Chat](../../docs/channels/web-chat-setup.md)
