'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { Tooltip } from '@/components/tooltip';

export const Icon = ({
  tooltipLabel,
  textLabel,
  href,
  src,
  IconComponent,
  size = 16,
  className,
  style,
  newTab = true,
}: IconProps) => {
  const iconContent = (
    <div
      style={style}
      className={clsx(
        'z-20 flex items-center justify-center rounded-full p-1 transition hover:bg-gray-900/30',
        className
      )}
    >
      {src ? (
        <div className='flex items-center justify-center gap-1.5 text-white'>
          <Image
            src={src}
            alt={tooltipLabel || 'icon'}
            width={size}
            height={size}
            className='opacity-80 transition hover:opacity-100'
          />
          {textLabel && (
            <p className='hidden text-xs font-medium sm:block xl:hidden'>
              {textLabel}
            </p>
          )}
        </div>
      ) : IconComponent ? (
        <div className='flex items-center justify-center gap-1.5 text-white'>
          <IconComponent size={size} />
          {textLabel && (
            <p className='hidden text-xs font-medium sm:block xl:hidden'>
              {textLabel}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );

  const wrappedContent = href ? (
    <Link
      href={href}
      target={newTab ? '_blank' : '_self'}
      rel='noopener noreferrer'
    >
      {iconContent}
    </Link>
  ) : (
    iconContent
  );

  return tooltipLabel ? (
    <Tooltip label={tooltipLabel}>{wrappedContent}</Tooltip>
  ) : (
    wrappedContent
  );
};
