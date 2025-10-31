import contacts from '@/app/data/contacts.json';
import Image from 'next/image';
import { useState } from 'react';

export const Contact = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className='relative grid grid-cols-3 place-items-center gap-3'>
      {contacts?.map((item, i) => (
        <div key={i} className='flex flex-col items-center'>
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className='relative group size-12 flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer'
          >
            <Image
              src={item.icon}
              alt={'contact icon'}
              height={80}
              width={80}
              className='size-10 object-contain'
            />
            {/* Tooltip */}
            <div
              className={`absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-2xl bg-black/80 text-white whitespace-nowrap transition-opacity duration-200 ${
                hovered === i ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {item.description}
            </div>
          </div>
          <p className='text-xs text-slate-200 capitalize'>{item.title}</p>
        </div>
      ))}
    </div>
  );
};
