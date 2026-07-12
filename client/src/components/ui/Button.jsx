import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover border border-transparent',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 border border-transparent',
  outline: 'border border-border bg-surface text-text hover:bg-surface-hover',
  ghost: 'border border-transparent bg-transparent text-text-muted hover:bg-surface-hover hover:text-text',
  danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent',
};

const sizes = {
  sm: 'px-3.5 py-1.75 text-sm',
  md: 'px-4.5 py-2.5 text-sm',
  lg: 'px-6.5 py-3.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.985 }}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
