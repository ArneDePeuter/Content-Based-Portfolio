import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, 'public', 'llms.txt');

const CONTENT_DIRS = [
  'src/content/timeline',
  'src/content/posts',
];

const PERSONAL_INFO = `# Arne De Peuter

I build backend systems and work with data, focusing on structure and performance.

I am mainly interested in how systems are designed and how data moves through them. Most of my work sits between backend development, data engineering, and machine learning.

I like working on systems end-to-end, from designing architecture to building the backend and experimenting with data and models on top of it.

## Contact
- Email: arne@depeuter.org
- LinkedIn: https://linkedin.com/in/arne-de-peuter-4055a6267
- GitHub: https://github.com/ArneDePeuter
- LeetCode: https://leetcode.com/ArneDP

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