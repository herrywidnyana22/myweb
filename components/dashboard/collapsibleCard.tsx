'use client';

import clsx from 'clsx';
import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleCardProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleCard = ({
  title,
  children,
  defaultExpanded = true,
  className,
}: CollapsibleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-600 bg-gray-700 shadow-lg',
        className
      )}
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex cursor-pointer items-center justify-between rounded-t-lg p-4 transition-colors hover:bg-gray-600/50'
      >
        <h2 className='text-xl font-semibold text-white'>{title}</h2>
        <button
          type='button'
          className='rounded-md p-1 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white'
          onClick={e => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Content */}
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className='p-6 pt-2'>{children}</div>
      </div>
    </div>
  );
};
