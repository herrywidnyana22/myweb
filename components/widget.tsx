'use client';

import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

export const Widget = ({ dockTarget, isOpen, children, className, isChatMaximized = false }: WidgetProps & { isChatMaximized?: boolean }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const computeOffset = () => {
    if (!dockTarget || !ref.current) return { x: 0, y: 0 };
    const widgetRect = ref.current.getBoundingClientRect();
    const fromX = dockTarget.left + dockTarget.width / 2;
    const fromY = dockTarget.top + dockTarget.height / 2;
    const toX = widgetRect.left + widgetRect.width / 2;
    const toY = widgetRect.top + widgetRect.height / 2;
    return { x: fromX - toX, y: fromY - toY };
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    const next = computeOffset();
    setOffset(next);
    const onResize = () => setOffset(computeOffset());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dockTarget]);

  return (
    <AnimatePresence>
      {isOpen && !isChatMaximized && (
        <motion.div
          ref={ref}
          initial={{
            opacity: 0,
            scale: 0.85,
            x: offset.x,
            y: offset.y,
            originX: 0.5,
            originY: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.85,
            x: offset.x,
            y: offset.y,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={clsx(
            'relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto max-h-[70vh] overflow-auto',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
