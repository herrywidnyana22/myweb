import contact from '@/app/data/contact.json';
import Image from 'next/image';
import { useState } from 'react';

export const Contact = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className='relative grid grid-cols-3 place-items-center gap-4'>
      {contact.map((item, i) => (
        <div key={i} className='flex flex-col items-center'>
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className='relative group size-16 flex items-center justify-center transition-transform duration-300 hover:scale-120 cursor-pointer'
          >
            <Image
              src={item.icon}
              alt={item.type}
              height={80}
              width={80}
              className='size-14 object-contain'
            />
            {/* Tooltip */}
            <div
              className={`absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-2xl bg-black/80 text-white whitespace-nowrap transition-opacity duration-200 ${
                hovered === i ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {item.value}
            </div>
          </div>
          <p className='text-sm text-slate-200 capitalize'>{item.type}</p>
        </div>
      ))}
    </div>
  );
};
