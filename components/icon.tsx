'use client';

import { Tooltip } from '@/components/tooltip';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';


export const Icon = ({
  tooltipLabel,
  textLabel,
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
      {src 
      ? <div className='text-white flex items-center justify-center gap-1.5'>
          <Image
            src={src}
            alt={tooltipLabel || 'icon'}
            width={size}
            height={size}
            className="opacity-80 hover:opacity-100 transition"
          />
          {textLabel && <p className="hidden sm:block xl:hidden text-xs font-medium">{textLabel}</p>}
      </div> : IconComponent 
      ? <div className='text-white flex items-center justify-center gap-1.5'>
          <IconComponent size={size}/>
          {textLabel && <p className="hidden sm:block xl:hidden text-xs font-medium">{textLabel}</p>}
        </div> 
      : null}
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

  return tooltipLabel ? (
    <Tooltip label={tooltipLabel}>{wrappedContent}</Tooltip>
  ) : (
    wrappedContent
  );
};
