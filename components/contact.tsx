'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Tooltip } from './tooltip';
import { useData } from '@/lib/useData';

export const Contact = () => {
  const { data, isLoading, error } = useData<ContactProps>('contacts');

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 place-items-center gap-3 p-4 sm:p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="relative flex flex-col gap-2 items-center justify-center">
              <div className="flex items-center justify-center p-2 bg-gray-700 rounded-2xl size-16 animate-pulse" />
              <div className="h-3 w-12 bg-gray-600 rounded mt-2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 p-4">Gagal memuat kontak.</p>;
  }

  return (
    <div className="grid grid-cols-2 place-items-center gap-3 p-4 sm:p-6">
      {data?.map((item, i) => (
        <Tooltip key={i} label={item.description}>
          <Link 
            href={item.href || '#'} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <div className="relative flex flex-col gap-2 items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer">
              <div className="flex items-center justify-center p-2 bg-amber-50 rounded-2xl size-16">
                {item.icon && typeof item.icon === 'string' && (
                  <Image
                    src={item.icon}
                    alt="contact icon"
                    height={80}
                    width={80}
                    className="size-20 object-contain"
                  />
                )}
              </div>
              <p className="text-xs text-slate-200 capitalize">{item.title}</p>
            </div>
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};
