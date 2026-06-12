export default function Select({ label, options, className = '', ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-text-muted">{label}</label>}
      <select
        className={`w-full bg-background border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
