import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-surface border border-border rounded-md p-6 ${hover ? 'hover:border-primary/40 hover:shadow-[0_1px_0_rgba(31,35,40,0.08)] transition-colors' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
