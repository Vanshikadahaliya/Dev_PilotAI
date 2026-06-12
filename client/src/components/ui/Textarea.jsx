export default function Textarea({ label, className = '', ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-text-muted">{label}</label>}
      <textarea
        className={`w-full bg-background border border-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y min-h-[120px] ${className}`}
        {...props}
      />
    </div>
  );
}
