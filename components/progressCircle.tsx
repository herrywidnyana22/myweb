'use client';

import clsx from 'clsx';
import { Tooltip } from './tooltip';

export const ProgressCircle = ({
  value,
  label,
  className,
}: ProgressCircleProps) => {
  const radius = 25; // circle radius
  const stroke = 6; // stroke width
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;

  // Tentukan warna berdasarkan value
  const getStrokeColor = () => {
    if (value > 80) return '#32D74B'; // Hijau (iOS green)
    if (value > 50) return '#FFA500'; // Oranye
    return '#FF3B30'; // Merah (iOS red)
  };

  return (
    <Tooltip label={`${label} ${value}%`}>
      <div
        className={clsx(
          'flex flex-col items-center justify-center relative',
          className
        )}
      >
        <svg
          className='rotate-[-90deg]'
          width={radius * 2 + stroke * 2}
          height={radius * 2 + stroke * 2}
        >
          {/* Background Circle */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            stroke='#2C2C2E'
            strokeWidth={stroke}
            fill='none'
          />
          {/* Progress Circle */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            stroke={getStrokeColor()}
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
          <span className='text-white font-light text-[14px] capitalize'>
            {value}
            <span className='text-xs text-white/70'>%</span>
          </span>
        </div>
      </div>
    </Tooltip>
  );
};
