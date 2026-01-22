import useWindowStore from '@/store/window';

import { useAppStore } from '@/store/app';
import { Minus, X } from 'lucide-react';

export const WindowControls = ({ target }: WindowControlProps) => {
  const { closeWindow, minimizeWindow } = useWindowStore();
  const { setOpenedDockId } = useAppStore();

  const onAction = (action: WindowControlAction) => {
    if (action === 'minimize') {
      minimizeWindow(target);
      return;
    }

    if (target === 'resume' || target === 'explorer') {
      setOpenedDockId(prev => ({ ...prev, [target]: !prev[target as string] }));
    }

    closeWindow(target);
  };

  return (
    <div className='flex gap-2'>
      <div
        onClick={() => onAction('close')}
        className='flex size-3.5 cursor-pointer items-center justify-center rounded-full bg-rose-500 p-0.5'
      >
        <X className='size-3 font-bold text-white' />
      </div>
      <div
        onClick={() => onAction('minimize')}
        className='flex size-3.5 cursor-pointer items-center justify-center rounded-full bg-orange-300 p-0.5'
      >
        <Minus className='size-3 font-bold text-white' />
      </div>
    </div>
  );
};
