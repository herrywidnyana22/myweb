import Image from 'next/image';
import { ReactNode } from 'react';
import { WindowControls } from '@/components/windowControls';

interface WindowHeaderProps {
  target: WindowKey;
  title?: string | ReactNode;
  icon?: string | null;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  centerContent?: ReactNode;
}

export const WindowHeader = ({
  target,
  title,
  icon,
  leftContent,
  rightContent,
  centerContent,
}: WindowHeaderProps) => {
  return (
    <div className='window-header relative flex cursor-grab items-center border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400 select-none active:cursor-grabbing'>
      {/* Left */}
      <div className='z-10 flex items-center gap-2'>
        <WindowControls target={target} />
        {leftContent}
      </div>

      {/* Center Title */}
      {centerContent ? (
        centerContent
      ) : (
        <div className='absolute left-1/2 flex -translate-x-1/2 items-center gap-1 font-semibold text-gray-600'>
          {icon && (
            <div className='size-4 overflow-hidden rounded-md'>
              <Image
                src={icon}
                alt='icon'
                width={32}
                height={32}
                className='size-4 object-cover'
              />
            </div>
          )}
          {title && <p>{title}</p>}
        </div>
      )}

      {/* Right */}
      <div className='z-10 ml-auto'>{rightContent}</div>
    </div>
  );
};
