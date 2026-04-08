import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  delay?: number;
  y?: number;
  className?: string;
  mode?: 'inView' | 'onLoad';
}>;

export default function MotionReveal({
  children,
  delay = 0,
  y = 24,
  className,
  mode = 'inView',
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(mode === 'inView'
        ? {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
          }
        : {
            animate: { opacity: 1, y: 0 },
          })}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}