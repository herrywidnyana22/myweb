'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

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
    <div className={clsx('bg-gray-700 rounded-lg shadow-lg border border-gray-600', className)}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-600/50 transition-colors rounded-t-lg"
      >
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button
          type="button"
          className="text-gray-300 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-600"
          onClick={(e) => {
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
        <div className="p-6 pt-2">{children}</div>
      </div>
    </div>
  );
};
