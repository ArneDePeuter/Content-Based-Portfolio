import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  delay?: number;
  y?: number;
}>;

export default function MotionFade({ children, delay = 0, y = 24 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}