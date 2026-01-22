import clsx from 'clsx';

import { parseHighlight } from '@/lib/utils/parseHighlight';

export const ChatItemTelegram = ({
  message,
  headerText,
  icon: Icon,
  className,
}: ChatTelegramProps) => {
  return (
    <div className='flex flex-col gap-2 whitespace-pre-wrap'>
      <div className={clsx('flex items-center gap-1 italic', className)}>
        <Icon size={16} />
        <p className='text-xs'>{headerText}</p>
      </div>
      {parseHighlight(message || '')}
    </div>
  );
};
