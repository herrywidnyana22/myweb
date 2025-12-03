'use client';

import clsx from 'clsx';
import { Tooltip } from '../tooltip';
import { getColor } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const ProgressCircle = ({
  value,
  label,
  className,
}: CircleProgressProps) => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ukuran menyesuaikan device
  const radius = isMobile ? 18 : 25;     
  const stroke = isMobile ? 4 : 6;       
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;

  return (
    <Tooltip label={`${label} ${value}%`}>
      <div
        className={clsx(
          'flex flex-col items-center justify-center relative',
          className
        )}
      >
        <svg
          className='-rotate-90'
          width={radius * 2 + stroke * 2}
          height={radius * 2 + stroke * 2}
        >
          {/* Background Circle */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            stroke='#D4D4D4'
            strokeWidth={stroke}
            fill='none'
          />

          {/* Progress circle */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            stroke={getColor(value)}
            strokeWidth={stroke}
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap='round'
            className='transition-all duration-500 ease-out'
          />
        </svg>

        {/* Value in center */}
        <div className='absolute flex flex-col items-center justify-center'>
          <span className={clsx(
            'text-gray-900/90 font-light capitalize',
            isMobile ? 'text-[12px]' : 'text-[14px]'      // font juga ikut kecil
          )}>
            {value}
            <span className={isMobile ? 'text-[10px]' : 'text-xs text-gray-900/70'}>%</span>
          </span>
        </div>
      </div>
    </Tooltip>
  );
};
