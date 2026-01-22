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
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-error'> *</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-gray-700 transition outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
      />
      {error && <p className='text-error mt-1 text-xs'>{error}</p>}
    </div>
  );
}
