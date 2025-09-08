import { CircleChevronDown, CircleMinus, CircleX } from 'lucide-react';

export const ChatHeader = ({ isMinimized, onClear, onMinimize }: ChatHeaderProps) => {
  return (
    <div className=' px-5 py-2 bg-gray-900 border-b border-gray-700'>
      <div className='flex items-center gap-2 text-gray-300'>
        <button
          className='size-4 flex items-center justify-center rounded-full bg-red-500 text-white transition cursor-pointer'
          onClick={onClear}
        >
          <CircleX size={85} />
        </button>
        <button
          className='size-4 flex items-center justify-center rounded-full bg-yellow-500 text-white transition cursor-pointer'
          onClick={onMinimize}
        >
          {isMinimized ? <CircleChevronDown size={20} /> : <CircleMinus size={85} />}
        </button>
      </div>
    </div>
  );
};
