import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, 'public', 'llms.txt');

const CONTENT_DIRS = [
  'src/content/timeline',
  'src/content/posts',
];

const hero = JSON.parse(await fs.readFile(path.join(ROOT, 'src/content/hero.json'), 'utf8'));

const dob = new Date(hero.dateOfBirth);
const age = new Date().getFullYear() - dob.getFullYear();
const dobFormatted = dob.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const PERSONAL_INFO = `# ${hero.firstName} ${hero.lastName}
${hero.tagline}

${hero.headline} ${hero.headlineAccent}

${hero.bio.join('\n\n')}

## Personal
- Date of birth: ${dobFormatted} (age ${age})
- Location: ${hero.location}
- Nationality: ${hero.nationality}
- Languages: ${hero.languages.map((l) => `${l.name} (${l.level})`).join(', ')}

## Contact
- Email: ${hero.email}
${hero.socialLinks.map((l) => `- ${l.label}: ${l.url}`).join('\n')}

## Tech Stack
${hero.techStack.map((t) => t.name).join(', ')}

## Notes
- Posts with "work: true" = work experience
- Posts with "work: false" = projects
- Timeline JSON provides supporting context

---`;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walk(full));
      continue;
    }

    if (
      entry.isFile() &&
      (entry.name.endsWith('.md') ||
       entry.name.endsWith('.mdx') ||
       entry.name.endsWith('.json'))
    ) {
      files.push(full);
    }
  }

  return files;
}

async function collectFiles() {
  const all = [];

  for (const dir of CONTENT_DIRS) {
    const abs = path.join(ROOT, dir);
    try {
      await fs.access(abs);
      all.push(...await walk(abs));
    } catch {}
  }

  return all.sort();
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

async function main() {
  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });

  const files = await collectFiles();

  const sections = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, 'utf8');

      return `

## FILE: ${rel(file)}

${content}
`;
    })
  );

  const final = `${PERSONAL_INFO}

# Combined Content
All source markdown and JSON files:

${sections.join('\n')}
`;

  await fs.writeFile(OUTPUT, final, 'utf8');

  console.log(`Generated ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});