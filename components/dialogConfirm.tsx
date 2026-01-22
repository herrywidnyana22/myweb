import { useLocalizedText } from '@/hooks/useLocalizedText';
import { memo } from 'react';

export default memo(function DialogConfirm({
  text,
  onConfirm,
  onCancel,
}: DialogConfirmProps) {
  const { getUIText } = useLocalizedText();
  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4'>
      <div className='w-full max-w-xs rounded-xl border border-white/20 bg-gray-900 p-4 text-center shadow-lg transition-all duration-300 sm:max-w-sm sm:p-6'>
        {/* Text */}
        <p className='mb-4 text-sm leading-relaxed text-gray-200 sm:mb-5 sm:text-base'>
          {text}
        </p>

        {/* Buttons */}
        <div className='flex justify-center gap-3 sm:gap-4'>
          <button
            onClick={onCancel}
            className='rounded-md bg-gray-600 px-3 py-1.5 text-sm text-white transition hover:bg-gray-700 active:scale-[0.98] sm:px-4 sm:py-2 sm:text-base'
          >
            {getUIText('cancel')}
          </button>

          <button
            onClick={onConfirm}
            className='rounded-md bg-red-500 px-3 py-1.5 text-sm text-white transition hover:bg-red-600 active:scale-[0.98] sm:rounded-lg sm:px-4 sm:py-2 sm:text-base'
          >
            {getUIText('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
});
