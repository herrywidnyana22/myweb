'use client';

import clsx from 'clsx';
import { Minimize2, Trash2 } from 'lucide-react';

export const ChatHeader = ({ onMinimize, onClear, isMinimized }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-linear-to-tr from-primary to-primary-light w-9 h-9 flex items-center justify-center text-white">
          H
        </div>
        <div>
          <div className="text-sm font-medium">Herry Chat</div>
          <div className="text-xs text-gray-400">Portfolio Assistant</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onClear()}
          title="Clear chat"
          className={clsx('p-2 rounded-md hover:bg-gray-500/80 cursor-pointer')}
          type="button"
        >
          <Trash2 size={16} />
        </button>

        <button
          onClick={() => onMinimize()}
          title={isMinimized ? 'Open' : 'Minimize'}
          className={clsx('p-2 rounded-md hover:bg-gray-500/80 cursor-pointer')}
          type="button"
        >
          <Minimize2 size={16} />
        </button>
      </div>
    </div>
  );
};
