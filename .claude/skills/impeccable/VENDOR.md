# Vendored skill

This directory is a copy of the **impeccable** skill, not code written for Tally.

| | |
|---|---|
| Upstream | https://github.com/pbakaus/impeccable |
| Author | Paul Bakaus |
| License | Apache-2.0 (see `LICENSE`, third-party credits in `NOTICE.md`) |
| Package version | 3.4.0 |
| Skill version | 4.0.3 |
| Commit vendored | `9ee5c1b1df154efec0b53a42c9c78c4977017f6f` |
| Vendored on | 2026-07-29 |

## Updating

Upstream ships a ready-made `.claude/` tree, so an update is a re-copy:

```sh
git clone --depth 1 https://github.com/pbakaus/impeccable /tmp/impeccable
rm -rf .claude/skills/impeccable .claude/agents/impeccable-*.md
cp -R /tmp/impeccable/.claude/skills/impeccable .claude/skills/
cp /tmp/impeccable/.claude/agents/impeccable-*.md .claude/agents/
cp /tmp/impeccable/LICENSE .claude/skills/impeccable/LICENSE
cp /tmp/impeccable/NOTICE.md .claude/skills/impeccable/NOTICE.md
```

Then update the version and commit rows above. Upstream also supports
`npx impeccable install`, which does the same copy and additionally offers the
optional detector hooks described below.

## What was left out on purpose

Upstream's `.claude/settings.json` registers two hooks: a `PostToolUse` check
after every Edit/Write/MultiEdit on UI files, and a full deep pass on `Stop`.
They are not installed here — they would run `node` on every edit in this repo
for every session. To opt in, copy `settings.json` from the upstream repo, or
run `npx impeccable install` and accept the hooks.

## Requirements

The skill's scripts need Node >= 22.12 on PATH. Without it the skill's prose
guidance still works; the detector and live-browser scripts do not.
