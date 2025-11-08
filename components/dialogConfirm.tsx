import { memo } from 'react';

export default memo(function DialogConfirm({ text, onConfirm, onCancel }: DialogConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999 px-4">
      <div
        className="
          bg-gray-900 
          p-4 sm:p-6 
          rounded-lg sm:rounded-xl 
          shadow-lg text-center 
          border border-white/20 
          w-full max-w-xs sm:max-w-sm
          transition-all duration-300
        "
      >
        {/* Text */}
        <p className="text-gray-200 text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">
          {text}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3 sm:gap-4">
          <button
            onClick={onConfirm}
            className="
              px-3 sm:px-4 py-1.5 sm:py-2 
              bg-red-500 
              rounded-md sm:rounded-lg 
              text-white text-sm sm:text-base
              hover:bg-red-600 
              active:scale-[0.98] 
              transition
            "
          >
            Ya, hapus
          </button>

          <button
            onClick={onCancel}
            className="
              px-3 sm:px-4 py-1.5 sm:py-2 
              bg-gray-600 
              rounded-md sm:rounded-lg 
              text-white text-sm sm:text-base
              hover:bg-gray-700 
              active:scale-[0.98] 
              transition
            "
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
});
