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
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-error'> *</span>}
        </label>
      )}
      <input
        {...props}
        className={`focus:ring-primary w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 transition outline-none focus:border-transparent focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
      />
      {error && <p className='text-error mt-1 text-xs'>{error}</p>}
    </div>
  );
}
