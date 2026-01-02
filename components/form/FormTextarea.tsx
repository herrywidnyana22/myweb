'use client';

export function FormTextarea({
  label,
  required,
  error,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${className}`}
      />
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
