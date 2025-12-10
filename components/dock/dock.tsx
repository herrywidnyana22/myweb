'use client';

import gsap from 'gsap';
import Image from 'next/image';
import clsx from 'clsx';
import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';

import useWindowStore from '@/store/window';
import { dockItems } from './dockItems';
import { Tooltip } from '../tooltip';
import { useAppStore } from '@/store/app';

gsap.registerPlugin(useGSAP);

export const Dock = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { windows, openWindow, minimizeWindow, restoreWindow } = useWindowStore();
  const { openedDockId, setOpenedDockId, setTargetedDockId, isInputFocused } = useAppStore();

  useGSAP(
    () => {
      const dock = dockRef.current;
      if (!dock) return;

      const icons = dock.querySelectorAll<HTMLButtonElement>('.dock-icon');

      const animateIcons = (mouseX: number) => {
        const rect = dock.getBoundingClientRect();

        icons.forEach((icon) => {
          const { left, width } = icon.getBoundingClientRect();
          const center = left - rect.left + width / 2;

          const distance = Math.abs(mouseX - center);
          const intensity = Math.exp(-(distance ** 2.5) / 20000);

          gsap.to(icon, {
            scale: 1 + intensity * 0.25,
            y: intensity * -15,
            duration: 0.2,
            ease: 'power2.out',
          });
        });
      };

      const onMove = (e: MouseEvent) => {
        const rect = dock.getBoundingClientRect();
        animateIcons(e.clientX - rect.left);
      };

      const onLeave = () => {
        icons.forEach((icon) => {
          gsap.to(icon, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      };

      dock.addEventListener('mousemove', onMove);
      dock.addEventListener('mouseleave', onLeave);

      return () => {
        dock.removeEventListener('mousemove', onMove);
        dock.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: dockRef }
  );

  const onDockClick = (id: string) => {
    const button = iconRefs.current[id]
    const rect = button?.getBoundingClientRect()

    const win = windows[id]
    const isSpecial = id === "resume" || id === "explorer"

    if (win && isSpecial) {
      // CASE 1 — window open → MINIMIZE
      if (win.isOpen && !win.isMinimize) {
        minimizeWindow(id);
      }
      // CASE 2 — window minimized → RESTORE
      else if (win.isMinimize) {
        restoreWindow(id);
      }
      // CASE 3 — not open → OPEN
      else {
        openWindow(id);
      }

      setOpenedDockId((prev) => ({
        ...prev,
        [id]: true,
      }))

      return
    }

    // Track dock popup target
    if (rect) {
      setTargetedDockId((prev) => ({ ...prev, [id]: rect }));
      setOpenedDockId((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-1/2 -translate-x-1/2 z-50',
        isInputFocused ? 'hidden sm:block' : 'block'
      )}
    >
      <div className="absolute z-10 bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2">
        <div
          ref={dockRef}
          className="flex gap-3 p-2 px-3 shadow-2xl bg-white/20 backdrop-blur-2xl border border-white/20 rounded-2xl"
        >
          <div className="relative flex flex-col items-center">
            <Tooltip 
              label={"File Explorer"}
              bgColor="#000"
              textColor='text-white'
            >
              <button
                ref={el => { iconRefs.current['explorer'] = el; }}
                className="dock-icon size-10 sm:size-12 md:size-13 flex items-center justify-center"
                onClick={() => onDockClick('explorer')}
              >
                <Image src={'/icons/folder.png'} 
                  alt='icon' 
                  height={128} 
                  width={128} 
                  className='size-10 sm:size-12 md:size-13 object-cover'
                 />
              </button>
            </Tooltip>

            {/* Active Dot Indicator */}
            {!!openedDockId?.['explorer'] && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            )}
          </div>

          {dockItems.map((item) => (
            <div key={item.id} className="relative flex flex-col items-center z-50">
              <Tooltip 
                label={item.name}
                bgColor="#000"
                textColor='text-white'
              >
                <button
                  ref={el => { iconRefs.current[item.id] = el; }}
                  className="dock-icon size-10 sm:size-12 md:size-14 flex items-center justify-center"
                  onClick={() => onDockClick(item.id)}
                >
                  {item.icon ?? (
                    item.icon
                  )}
                </button>
              </Tooltip>

              {/* Active Dot Indicator */}
              {!!openedDockId?.[item.id] && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
              )}
            </div>
          ))}
          <div className="relative flex flex-col items-center">
            <Tooltip 
              label={"View Resume"}
              bgColor="#000"
              textColor='text-white'
            >
              <button
                ref={el => { iconRefs.current['resume'] = el }}
                className="dock-icon size-10 sm:size-12 md:size-14 flex items-center justify-center"
                onClick={() => onDockClick('resume')}
              >
                <Image src={'/icons/pdf.png'} 
                  alt='icon' 
                  height={128} 
                  width={128} 
                  className='size-10 sm:size-12 md:size-14 object-cover'
                 />
              </button>
            </Tooltip>

            {/* Active Dot Indicator */}
            {!!openedDockId?.['resume'] && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
