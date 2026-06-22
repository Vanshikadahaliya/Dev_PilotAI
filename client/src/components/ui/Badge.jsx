const colors = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  default: 'bg-surface-hover text-text-muted',
};

export default function Badge({ children, color = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
