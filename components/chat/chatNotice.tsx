import { useLocalizedText } from '@/hooks/useLocalizedText';
import { useChatStore } from '@/store/chat';
import { Power } from 'lucide-react';

export const ChatNotice = () => {
  const { setChatMode } = useChatStore();
  const { getUIText } = useLocalizedText();
  return (
    <div className='flex flex-col items-center justify-center pt-4 text-white'>
      <p className='text-center text-xs font-light'>
        {getUIText('telegramNotice')}
      </p>
      <button
        onClick={() => setChatMode('default')}
        className='mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-md border bg-gray-600/90 p-2 text-xs transition hover:bg-rose-500 hover:font-semibold'
      >
        <Power size={14} />
        {getUIText('turnOff')}
      </button>
    </div>
  );
};
