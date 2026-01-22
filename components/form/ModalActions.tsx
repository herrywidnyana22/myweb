'use client';

interface ModalActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

export function ModalActions({
  isSubmitting,
  onCancel,
  submitLabel = 'Save',
}: ModalActionsProps) {
  return (
    <div className='flex justify-end gap-4 border-t border-gray-200 pt-6'>
      <button
        type='button'
        onClick={onCancel}
        className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50 disabled:opacity-50'
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-primary hover:bg-primary-hover disabled:bg-primary-light rounded-lg px-4 py-2 text-white transition'
      >
        {isSubmitting ? `${submitLabel}...` : submitLabel}
      </button>
    </div>
  );
}
