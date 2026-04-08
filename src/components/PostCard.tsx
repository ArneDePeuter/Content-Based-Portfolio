import { motion } from 'framer-motion';

type Props = {
  title: string;
  excerpt: string;
  href: string;
  date: string;
  tags: string[];
};

export default function PostCard({ title, excerpt, href, date, tags }: Props) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.03] p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_30%)] opacity-0 transition group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-white transition group-hover:text-violet-200">{title}</h3>
          <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-zinc-500">{date}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-zinc-400">{excerpt}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition group-hover:border-violet-400/20 group-hover:text-zinc-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}