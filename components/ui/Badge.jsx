const colors = {
  primary: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
  success: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
  default: 'bg-surface-hover text-text-muted border border-border',
};

export default function Badge({ children, color = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
