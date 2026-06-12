import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface border border-border rounded-xl p-6 ${hover ? 'hover:border-primary/50 transition-colors cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
