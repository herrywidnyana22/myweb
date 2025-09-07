'use client';

import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const Widget = ({ dockTarget, isOpen, children, className }: WidgetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
            x: dockTarget ? dockTarget.left - 421 : window.innerWidth / 2 - 100 - 421,
            y: dockTarget ? dockTarget.top : window.innerHeight - 100,
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
            scale: 0,
            x: dockTarget ? dockTarget.left - 421 : window.innerWidth / 2 - 100 - 421,
            y: dockTarget ? dockTarget.top : window.innerHeight - 100,
          }}
          transition={{ duration: 0.5 }}
          className={clsx(
            'relative mt-20 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
