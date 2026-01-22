'use client';

import clsx from 'clsx';
interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={clsx(
        'bg-linier-to-r animate-pulse rounded-lg from-gray-700/40 via-gray-600/40 to-gray-700/40',
        className
      )}
    />
  );
};
