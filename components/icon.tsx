'use client';

import { Tooltip } from '@/components/tooltip';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';


export const Icon = ({
  label,
  href,
  src,
  IconComponent,
  size = 16,
  className,
  newTab = true,
}: IconProps) => {
  const iconContent = (
    <div
      className={clsx(
        'rounded-full p-1 flex items-center justify-center transition hover:bg-gray-900/30 z-20',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={label || 'icon'}
          width={size}
          height={size}
          className="opacity-80 hover:opacity-100 transition"
        />
      ) : IconComponent ? (
        <IconComponent size={size} className="text-neutral-400" />
      ) : null}
    </div>
  );

  const wrappedContent = href ? (
    <Link
      href={href}
      target={newTab ? '_blank' : '_self'}
      rel="noopener noreferrer"
    >
      {iconContent}
    </Link>
  ) : (
    iconContent
  );

  return label ? (
    <Tooltip label={label}>{wrappedContent}</Tooltip>
  ) : (
    wrappedContent
  );
};
