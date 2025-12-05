'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Tooltip } from './tooltip';
import { useData } from '@/hooks/useData';
import { useApp } from '@/context/AppContextProps';

export const Contact = () => {
  const { data, isLoading, error } = useData<ContactProps>('contacts');
  const {ui} = useApp()
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 place-items-center gap-2 sm:gap-3 p-3 sm:p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="relative flex flex-col gap-2 items-center justify-center">
              <div className="flex items-center justify-center bg-gray-700 rounded-xl size-12 sm:size-16 animate-pulse" />
              <div className="h-2 w-10 sm:w-12 bg-gray-600 rounded mt-2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 p-4">{ui.dataLoadFailed}</p>;
  }

  return (
    <div className="grid grid-cols-2 place-items-center gap-3 p-3">
      {data?.map((item, i) => (
        <Tooltip key={i} label={item.description}>
          <Link
            href={item.href || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <div className="relative flex flex-col gap-1 items-center justify-center transition-transform duration-300 hover:scale-105 sm:hover:scale-110 cursor-pointer">
              {/* Icon container */}
              <div className="flex items-center justify-center p-1.5 sm:p-2 bg-amber-50 rounded-md sm:rounded-xl size-13 sm:size-12 shadow-sm">
                {item.icon && typeof item.icon === 'string' && (
                  <Image
                    src={item.icon}
                    alt="contact icon"
                    height={60}
                    width={60}
                    className="size-10 sm:size-14 object-contain"
                  />
                )}
              </div>

              {/* Label */}
              <p className="text-[10px] md:w-14 lg:w-full text-center sm:text-xs text-slate-200 capitalize truncate">
                {item.title}
              </p>
            </div>
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};
