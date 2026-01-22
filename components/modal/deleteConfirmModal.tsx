'use client';

import { Loader2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  title,
  message,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='mx-4 w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-gray-700 p-6'>
          <h2 className='text-xl font-bold text-white'>{title}</h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className='text-gray-400 transition hover:text-white disabled:opacity-50'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          <p className='text-sm leading-relaxed text-gray-300'>{message}</p>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 border-t border-gray-700 p-6'>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className='rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className='flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-500'
          >
            {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
