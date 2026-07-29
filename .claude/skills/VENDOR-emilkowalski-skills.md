# Vendored skills — emilkowalski/skills

Eight sibling directories in `.claude/skills/` are copies of Emil Kowalski's
skills, not written for Tally:

`animation-vocabulary`, `apple-design`, `emil-design-eng`,
`find-animation-opportunities`, `improve-animations`, `pick-ui-library`,
`prototype`, `review-animations`

| | |
|---|---|
| Upstream | https://github.com/emilkowalski/skills |
| Author | Emil Kowalski |
| License | MIT (see `LICENSE-emilkowalski-skills`) |
| Commit vendored | `70744e3816f1d93eafb697161a8b880a7384c5ff` |
| Vendored on | 2026-07-29 |

## Updating

```sh
git clone --depth 1 https://github.com/emilkowalski/skills /tmp/emil-skills
cp -R /tmp/emil-skills/skills/* .claude/skills/
cp /tmp/emil-skills/LICENSE .claude/skills/LICENSE-emilkowalski-skills
```

Then update the commit row above. Upstream also supports
`npx skills@latest add emilkowalski/skills`, which installs the same files.

## Which ones run on their own

`pick-ui-library`, `prototype`, and `review-animations` set
`disable-model-invocation`, so they only run when you type them. The other five
can trigger from their descriptions — `emil-design-eng` has the broadest reach,
and design or animation requests may match it and `impeccable` at the same time.
If that gets noisy, invoke the one you want by name.

## Fit with this repo

These skills expect ordinary source files. Tally's UI lives as a JSON-encoded
string on one line of `index.html`, so anything that edits or scans source
directly needs the extract → edit → re-embed workflow rather than a plain edit.
