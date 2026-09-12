# Jira MCP Tool Catalogue

## Read Tools (R0 — always available)

### health_check
- **Description:** Validate the Jira connection and report authenticated user
- **Inputs:** None
- **Output:** User name, instance URL, mode, allowed projects
- **Risk:** R0 Read

### get_issue
- **Description:** Get full details of a Jira issue
- **Inputs:** `issueKey` (string) — e.g., "PROJ-123"
- **Output:** Summary, status, type, priority, assignee, reporter, dates, labels, description, URL
- **Risk:** R0 Read

### search_issues
- **Description:** Search issues using JQL
- **Inputs:** `jql` (string), `maxResults` (number, optional)
- **Output:** List of matching issues with key fields
- **Risk:** R0 Read

### my_issues
- **Description:** Get all open issues assigned to the current user
- **Inputs:** None
- **Output:** List of assigned open issues
- **Risk:** R0 Read

### get_board_issues
- **Description:** Get issues from the active sprint/board
- **Inputs:** `status` (string, optional)
- **Output:** List of active issues with assignees
- **Risk:** R0 Read

### whoami
- **Description:** Show authenticated user info
- **Inputs:** None
- **Risk:** R0 Read

## Write Tools (R2 — require JIRA_ENABLE_WRITES=true)

### create_issue
- **Inputs:** `projectKey`, `summary`, `description`, `issueType`, `priority`, `labels`, `parentKey`
- **Risk:** R2 Write

### update_issue
- **Inputs:** `issueKey`, `summary`, `description`, `labels`, `priority`
- **Risk:** R2 Write

### transition_issue
- **Inputs:** `issueKey`, `statusName`
- **Risk:** R2 Write

### add_comment
- **Inputs:** `issueKey`, `comment`
- **Risk:** R2 Write

### assign_issue
- **Inputs:** `issueKey`, `username`
- **Risk:** R2 Write

### log_work
- **Inputs:** `issueKey`, `timeSpent`, `comment`
- **Risk:** R2 Write
