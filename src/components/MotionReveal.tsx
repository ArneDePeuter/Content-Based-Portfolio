import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  delay?: number;
  y?: number;
  className?: string;
}>;

export default function MotionReveal({
  children,
  delay = 0,
  y = 24,
  className,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}