'use client';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className='text-error rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm'>
      {message}
    </div>
  );
}
