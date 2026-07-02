# Content based portfolio

`!Aware: this project is fully vibe-coded! :)`

A content-based personal portfolio built with [Astro](https://astro.build). Nothing is hardcoded in the UI — projects, work experience, education, and personal info all come from content files, so updating the site means editing content, not code.

## Content model

- **Projects & work experience** — `src/content/posts/*.mdx`. Each post has frontmatter (`title`, `description`, `date`, `tags`, `work`, `thumbnail`, `repo`) plus MDX body. Set `work: true` for a job, `work: false` (default) for a personal project.
- **Timeline** — `src/content/timeline/*.json`. One JSON file per entry (education or work), with `start`/`end` dates and `category: "education" | "work"`. Can optionally link to a related post via `relatedPost`.
- **Personal info** — `src/content/hero.json`. Name, tagline, bio, location, languages, contact/social links, and tech stack.

## Generated artifacts

- **`public/llms.txt`** — a plain-text summary of the site's content (personal info, tech stack, timeline, posts), generated automatically from the content files so an LLM can be pointed at it directly. Built via `npm run llms` ([scripts/generate-llms.mjs](scripts/generate-llms.mjs)), which also runs automatically as part of `npm run build`.
- **`public/cv.pdf`** — a formal CV rendered from the same content (hero info + timeline + posts) using Puppeteer. Build it with `npm run cv` ([scripts/export-cv.mjs](scripts/export-cv.mjs)).

## Hosting

Deployed on [Vercel](https://vercel.com).
