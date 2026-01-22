'use client';

export function ModalHeader({ title, onClose, disabled }: ModalHeaderProps) {
  return (
    <div className='sticky top-0 z-50 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white p-6'>
      <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
      <button
        onClick={onClose}
        disabled={disabled}
        className='text-gray-500 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50'
        aria-label='Close'
      >
        <svg
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </div>
  );
}
