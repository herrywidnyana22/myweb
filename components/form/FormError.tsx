'use client';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-lg text-sm">
      {message}
    </div>
  );
}
