"use client";

export default function Textarea({ label, className = '', ...props }) {
  return (
    <div className="space-y-2.5">
      {label && <label className="block text-sm font-medium text-text">{label}</label>}
      <textarea
        className={`w-full bg-surface border border-border rounded-md px-3.5 py-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary resize-y min-h-30 ${className}`}
        {...props}
      />
    </div>
  );
}
