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
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-error'> *</span>}
        </label>
      )}
      <select
        {...props}
        className={`focus:ring-primary w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 transition outline-none focus:border-transparent focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className='text-error mt-1 text-xs'>{error}</p>}
    </div>
  );
}
