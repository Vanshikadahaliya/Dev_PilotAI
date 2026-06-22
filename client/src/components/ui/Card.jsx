import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface border border-border rounded-xl p-6 ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
