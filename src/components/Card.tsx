import { motion } from 'framer-motion';

type Props = {
  title: string;
  description: string;
  href: string;
  date: string;
  tags: string[];
  thumbnail?: string;
};

export default function Card({
  title,
  description,
  href,
  date,
  tags,
  thumbnail,
}: Props) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/8 via-transparent to-violet-400/8 opacity-100" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-1 flex-col p-5">
        {thumbnail && (
          <div className="mb-5 overflow-hidden rounded-[20px] border border-white/10 bg-white/5">
            <img
              src={thumbnail}
              alt={title}
              className="h-36 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <h3 className="min-w-0 truncate text-xl font-semibold tracking-tight text-white transition duration-200 group-hover:text-cyan-200">
            {title}
          </h3>

          <span className="shrink-0 pt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            {date}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-7 text-zinc-400">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-300 transition duration-200 group-hover:border-cyan-400/20 group-hover:bg-white/[0.08]"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-500">
              +{tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-cyan-300/80 transition duration-200 group-hover:text-cyan-200">
          Learn more
          <svg
            className="h-4 w-4 transition duration-200 group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h12M12 5l5 5-5 5" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}