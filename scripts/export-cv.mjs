import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUTPUT = path.join(ROOT, 'public', 'cv.pdf');
const PORTFOLIO_URL = 'https://portfolio-kappa-three-2q1k0l1n0l.vercel.app/';

// ── Data loading ──────────────────────────────────────────────────────────────

async function loadHero() {
  const raw = await fs.readFile(path.join(ROOT, 'src/content/hero.json'), 'utf8');
  return JSON.parse(raw);
}

async function loadTimeline() {
  const dir = path.join(ROOT, 'src/content/timeline');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json'));
  const entries = await Promise.all(
    files.map(async (f) => JSON.parse(await fs.readFile(path.join(dir, f), 'utf8')))
  );
  return entries.sort((a, b) => b.start.localeCompare(a.start));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const raw = line.slice(colon + 1).trim();
    if (raw.startsWith('[')) {
      result[key] = raw.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
    } else if (raw === 'true') {
      result[key] = true;
    } else if (raw === 'false') {
      result[key] = false;
    } else {
      result[key] = raw.replace(/^["']|["']$/g, '');
    }
  }
  return result;
}

async function loadPosts() {
  const dir = path.join(ROOT, 'src/content/posts');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  const posts = await Promise.all(
    files.map(async (f) => parseFrontmatter(await fs.readFile(path.join(dir, f), 'utf8')))
  );
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ── Formatting helpers ────────────────────────────────────────────────────────

function fmtDate(d) {
  if (d === 'present') return 'Present';
  const [year, month] = d.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function calcAge(dob) {
  const d = new Date(dob);
  const now = new Date();
  const age = now.getFullYear() - d.getFullYear();
  return now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? age - 1 : age;
}

function fmtDob(dob) {
  return new Date(dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── HTML builder ──────────────────────────────────────────────────────────────

function timelineSection(title, entries) {
  if (!entries.length) return '';
  const rows = entries.map(({ title, organization, description, start, end }) => `
    <div class="entry">
      <div class="dates">${fmtDate(start)} – ${fmtDate(end)}</div>
      <div>
        <div class="entry-title">${title}${organization ? ` <span class="org">· ${organization}</span>` : ''}</div>
        ${description ? `<div class="entry-desc">${description}</div>` : ''}
      </div>
    </div>`).join('');
  return section(title, rows);
}

function section(title, inner) {
  return `
    <div class="section">
      <div class="section-title">${title}</div>
      ${inner}
    </div>`;
}

function buildHtml(hero, timeline, posts) {
  const { firstName, lastName, tagline, dateOfBirth, location, nationality, languages, email, bio, socialLinks, techStack } = hero;
  const age = calcAge(dateOfBirth);
  const dob = fmtDob(dateOfBirth);

  const work = timeline.filter((e) => e.category === 'work');
  const education = timeline.filter((e) => e.category === 'education');
  const projects = posts.filter((p) => !p.work);

  const contactItems = [location, nationality, `Born ${dob} (age ${age})`, languages.map((l) => `${l.name} (${l.level})`).join(' · ')];
  const links = [...socialLinks.map(({ label, url }) => `<a href="${url}">${label}</a>`), `<a href="${PORTFOLIO_URL}">Informal Portfolio</a>`].join(' · ');

  const projectsHtml = projects.map(({ title, description, tags = [], repo, date }) => `
    <div class="entry">
      <div class="dates">${date ? new Date(date).getFullYear() : ''}</div>
      <div>
        <span class="project-title">${title}</span>
        ${tags.length ? `<span class="project-tags">&ensp;${tags.join(' · ')}</span>` : ''}
        ${repo ? `<span class="project-tags">&ensp;<a href="${repo}">GitHub</a></span>` : ''}
        ${description ? `<div class="entry-desc">${description}</div>` : ''}
      </div>
    </div>`).join('');

  const techHtml = techStack.map(({ name }) => `<span class="tag">${name}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 9.5pt;
      color: #1e293b;
      background: #fff;
      padding: 1.1cm 1.8cm;
      line-height: 1.4;
    }
    a { color: #2563eb; text-decoration: none; }

    /* Header */
    .name { font-size: 23pt; font-weight: 700; letter-spacing: -0.02em; color: #0f172a; }
    .tagline { color: #475569; margin-top: 2px; font-size: 10pt; }
    .contact { display: flex; flex-wrap: wrap; gap: 0 1.2rem; margin-top: 6px; font-size: 8.5pt; color: #64748b; }
    .links { margin-top: 3px; font-size: 8.5pt; color: #64748b; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 8px 0; }

    /* Sections */
    .section { margin-bottom: 9px; }
    .section-title {
      font-size: 7pt; font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; color: #94a3b8;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 2px; margin-bottom: 6px;
    }

    /* Timeline + project entries share the same grid */
    .entry { display: grid; grid-template-columns: 140px 1fr; gap: 0.4rem; margin-bottom: 5px; }
    .dates { font-size: 8pt; color: #94a3b8; padding-top: 1px; white-space: nowrap; }
    .entry-title { font-weight: 600; font-size: 9pt; }
    .org { font-weight: 400; color: #64748b; }
    .entry-desc { color: #64748b; font-size: 8pt; margin-top: 1px; }

    /* Projects */
    .project-title { font-weight: 600; font-size: 9pt; }
    .project-tags { font-size: 8pt; color: #94a3b8; }

    /* About */
    .bio p { color: #475569; font-size: 9pt; margin-bottom: 3px; }

    /* Tags */
    .tags { display: flex; flex-wrap: wrap; gap: 4px; }
    .tag { background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 8pt; }
  </style>
</head>
<body>

  <div class="name">${firstName} ${lastName}</div>
  <div class="tagline">${tagline}</div>
  <div class="contact">
    ${contactItems.map((i) => `<span>${i}</span>`).join('')}
  </div>
  <div class="links" style="margin-top: 3px;"><a href="mailto:${email}">${email}</a></div>
  <div class="links" style="margin-top: 2px;">${links}</div>

  <hr class="divider">

  ${section('About', `<div class="bio">${bio.map((p) => `<p>${p}</p>`).join('')}</div>`)}

  ${timelineSection('Work Experience', work)}

  ${timelineSection('Education', education)}

  ${projectsHtml ? section('Projects', projectsHtml) : ''}

  ${section('Tech Stack', `<div class="tags">${techHtml}</div>`)}

</body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Loading content...');
  const [hero, timeline, posts] = await Promise.all([loadHero(), loadTimeline(), loadPosts()]);

  const html = buildHtml(hero, timeline, posts);

  console.log('Rendering PDF...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUTPUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });

  await browser.close();
  console.log(`CV saved → ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
