import React from 'react';

export default function DialogConfirm({ text, onConfirm, onCancel }: DialogConfirmProps) {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-9999'>
      <div className='bg-gray-900 p-6 rounded-xl shadow-lg text-center border border-white/20'>
        <p className='text-gray-200 mb-4'>{text}</p>
        <div className='flex justify-center gap-4'>
          <button
            className='px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 cursor-pointer'
            onClick={onConfirm}
          >
            Ya, hapus
          </button>
          <button
            className='px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 cursor-pointer'
            onClick={onCancel}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
