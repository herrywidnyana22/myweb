'use client';

export function ModalHeader({ title, onClose, disabled }: ModalHeaderProps) {
  return (
    <div className="sticky top-0 rounded-t-lg bg-white border-b border-gray-200 p-6 flex justify-between items-center z-50">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <button
        onClick={onClose}
        disabled={disabled}
        className="text-gray-500 hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Close"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
