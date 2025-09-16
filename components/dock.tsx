'use client';

import { useState, useRef } from 'react';
import { motion, } from 'framer-motion';
import { Tooltip } from './tooltip';

export const Dock = ({ items, onIconClick, isOpenById }: DockProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const getTransform = (index: number) => {
    if (hoveredIndex === null) return { scale: 1, y: 0 };

    const distance = Math.abs(index - hoveredIndex);

    if (distance === 0) return { scale: 1.6, y: -10 }; // main
    if (distance === 1) return { scale: 1.3, y: -6 }; // neighbor
    if (distance === 2) return { scale: 1.15, y: -3 }; // next neighbor
    return { scale: 1, y: 0 };
  };

  return (
    <div className='fixed z-10 bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-12 left-1/2 -translate-x-1/2'>
      <div className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl'>
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={el => {
              refs.current[item.id] = el;
            }}
            className='relative flex flex-col items-center'
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Icon */}
            <Tooltip label={item.name}>

            <motion.button
              onClick={() => {
                const rect = refs.current[item.id]?.getBoundingClientRect();
                if (rect) onIconClick(item.id, rect);
              }}
              animate={getTransform(index)}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 18,
                mass: 0.5,
              }}
              className='size-10 sm:size-12 md:size-14 flex items-center justify-center'
            >
              {item.icon}
            </motion.button>
            </Tooltip>

            {/* Active indicator dot (absolute, does not affect layout) */}
            {isOpenById?.[item.id] && (
              <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.9)] pointer-events-none' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
