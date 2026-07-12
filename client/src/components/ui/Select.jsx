export default function Select({ label, options, className = '', ...props }) {
  return (
    <div className="space-y-2.5">
      {label && <label className="block text-sm font-medium text-text">{label}</label>}
      <select
        className={`w-full bg-surface border border-border rounded-md px-3.5 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary ${className}`}
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
