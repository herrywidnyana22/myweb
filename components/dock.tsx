'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DockProps = {
  items: DockItemProps[];
  onIconClick: (id: string, rect: DOMRect) => void;
};

export const Dock = ({ items, onIconClick }: DockProps) => {
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
    <div className='fixed bottom-12 left-1/2 -translate-x-1/2 z-50'>
      <div className='flex gap-6 px-6 py-3 shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl'>
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
              className='size-12 flex items-center justify-center'
            >
              {item.icon}
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: -4 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className='absolute -top-8 px-2 py-1 bg-black/80 text-white text-xs rounded-lg pointer-events-none whitespace-nowrap'
                >
                  {item.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
