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
    <div className="flex gap-4 justify-end border-t border-gray-200 pt-6">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-primary-light text-white rounded-lg transition"
      >
        {isSubmitting ? `${submitLabel}...` : submitLabel}
      </button>
    </div>
  );
}
