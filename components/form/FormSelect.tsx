'use client';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export function FormSelect({
  label,
  required,
  options,
  error,
  className = '',
  ...props
}: FormSelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
