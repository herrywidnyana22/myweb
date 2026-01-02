'use client';

export function FormInput({
  label,
  required,
  error,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      />
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
