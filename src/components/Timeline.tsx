import MotionReveal from './MotionReveal';

type TimelineItem = {
  id: string;
  title: string;
  description: string;
  organization?: string;
  start: string; // YYYY-MM
  end: string | 'present'; // YYYY-MM or 'present'
  category: 'education' | 'work';
  href?: string;
  hrefLabel?: string;
};

type Props = {
  items: TimelineItem[];
};

function toDate(value: string | 'present', isEnd = false) {
  if (value === 'present') return new Date();

  const [year, month] = value.split('-').map(Number);
  return new Date(year, (month ?? (isEnd ? 12 : 1)) - 1, 1);
}

function formatDate(value: string | 'present') {
  if (value === 'present') return 'Present';

  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

function formatRange(start: string, end: string | 'present') {
  return `${formatDate(start)} — ${formatDate(end)}`;
}

function sortItems(items: TimelineItem[]) {
  return [...items].sort((a, b) => {
    const aStart = toDate(a.start).getTime();
    const bStart = toDate(b.start).getTime();

    if (bStart !== aStart) return bStart - aStart;

    const aEnd = toDate(a.end, true).getTime();
    const bEnd = toDate(b.end, true).getTime();

    return bEnd - aEnd;
  });
}

function getStyles(category: TimelineItem['category']) {
  switch (category) {
    case 'education':
      return {
        text: 'text-cyan-300',
        border: 'border-cyan-400/30',
        link: 'text-cyan-300 hover:text-cyan-200',
      };
    case 'work':
      return {
        text: 'text-emerald-300',
        border: 'border-emerald-400/30',
        link: 'text-emerald-300 hover:text-emerald-200',
      };
  }
}

export default function Timeline({ items }: Props) {
  const education = sortItems(items.filter((item) => item.category === 'education'));
  const work = sortItems(items.filter((item) => item.category === 'work'));

  const lanes = [
    { title: 'Education', items: education },
    { title: 'Work', items: work },
  ].filter((lane) => lane.items.length > 0);

  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2">
      {lanes.map((lane) => (
        <div key={lane.title} className="relative">
          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {lane.title}
            </h3>
          </div>

          <div className="absolute bottom-0 left-[11px] top-10 w-px bg-white/10" />

          <div className="space-y-8 pt-2">
            {lane.items.map((item, index) => {
              const styles = getStyles(item.category);

              return (
                <MotionReveal
                  key={item.id}
                  delay={index * 0.06}
                  className="group relative pl-10 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <span
                    className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border bg-zinc-950 transition-all duration-200 ${styles.border}`}
                  />

                  <p className={`text-sm font-medium ${styles.text}`}>
                    {formatRange(item.start, item.end)}
                  </p>

                <h4 className="mt-1 text-lg font-semibold text-white transition group-hover:text-zinc-100">
                {item.title}
                </h4>

                {item.organization && (
                <p className="mt-1 text-sm font-medium text-zinc-500 transition group-hover:text-zinc-400">
                    {item.organization}
                </p>
                )}

                <p className="mt-3 text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300">
                {item.description}
                </p>

                  {item.href && (
                    <a
                      href={item.href}
                      className={`mt-3 inline-block text-sm font-medium transition ${styles.link}`}
                    >
                      {item.hrefLabel ?? 'Read more →'}
                    </a>
                  )}
                </MotionReveal>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}