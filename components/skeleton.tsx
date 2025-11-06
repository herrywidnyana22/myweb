'use client';

import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton loading shimmer
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-linier-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded-lg',
        className
      )}
    />
  );
};
