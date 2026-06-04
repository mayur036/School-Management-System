---
name: uses-bun-not-npm
description: User uses Bun as package manager/runtime, not npm — use bun commands in this project
metadata:
  type: feedback
---

For the School Management System project, the user uses **Bun** instead of npm. Use `bun install`, `bun add <pkg>`, `bun run <script>`, `bun start` — not the npm equivalents — in docs, commands, and instructions.

**Why:** The repo uses `bun.lock` files (root, client, server) and the user explicitly stated they use Bun.

**How to apply:** Default to bun in all generated commands, READMEs, and setup steps for this project. See [[school-mgmt-stack]].
