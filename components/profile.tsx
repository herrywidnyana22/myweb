import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import profileData from '@/app/data/profile.json';

export const Profile = () => {
  const { fullName, role, summary, image, birth, address } = profileData;

  return (
    <div className='flex items-center gap-4'>
      <div className='relative'>
        <Image
          src={image}
          alt={fullName}
          width={80}
          height={80}
          className='size-16 sm:size-20 rounded-full object-cover border-2 border-white/30'
        />
        <div className='absolute bottom-1 right-1 size-5 bg-green-500 rounded-full border-2 border-white/30'></div>
      </div>
      <div className='flex-1 min-w-0'>
        <h2 className='text-lg sm:text-xl font-bold text-white truncate'>{fullName}</h2>
        <p className='text-sm sm:text-base text-white/80 mb-1'>{role}</p>
        <p className='text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2'>
          {summary}
        </p>
        {/* Quick Info Grid */}
        <div className='grid grid-cols-2 gap-3 mt-2 '>
          <div className='flex items-center gap-2 text-white/80'>
            <MapPin size={14} className='text-white/60 flex-shrink-0' />
            <span className='text-xs sm:text-sm truncate'>{address.full}</span>
          </div>
          <div className='flex items-center gap-2 text-white/80'>
            <Calendar size={14} className='text-white/60 flex-shrink-0' />
            <span className='text-xs sm:text-sm'>
              {new Date(birth.date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
