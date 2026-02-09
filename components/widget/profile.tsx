'use client';

import Image from 'next/image';
import useDataStore from '@/store/data';
import { MapPin, Calendar } from 'lucide-react';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Profile = () => {
  const { profiles, isLoading, error } = useDataStore();
  const { getText, getUIText } = useLocalizedText();

  const profile = profiles[0];

  // Transform profile data for rendering
  const profileData = profile
    ? {
        fullName: profile.fullName,
        role: profile.role,
        summary: profile.quote,
        image: profile.photoURL,
        birth_date: profile.birthDate,
      }
    : null;

  const addressData = profile
    ? {
        address: profile.address,
        lat: profile.lat,
        lng: profile.lng,
        mapURL: profile.mapURL,
      }
    : null;

  if (isLoading) {
    return (
      <div className='relative flex animate-pulse items-center gap-4 p-4'>
        <div className='absolute top-2 right-2 flex gap-2'>
          <div className='size-8 rounded bg-gray-700' />
          <div className='size-8 rounded bg-gray-700' />
        </div>
        <div className='size-20 rounded-full bg-gray-700' />
        <div className='flex-1 space-y-2'>
          <div className='h-5 w-1/2 rounded bg-gray-700' />
          <div className='h-4 w-1/3 rounded bg-gray-700' />
          <div className='h-3 w-3/4 rounded bg-gray-700' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className='p-4 text-center text-red-400'>
        {getUIText('dataLoadFailed')}
      </p>
    );
  }

  if (!profileData || !addressData) {
    return (
      <p className='p-4 text-center text-gray-100'>{getUIText('dataEmpty')}</p>
    );
  }

  const { fullName, role, summary, image, birth_date } = profileData;
  const { address } = addressData;

  return (
    <div className='relative flex gap-4 overflow-hidden p-4 sm:p-6'>
      {/* Foto */}
      <div className='relative size-16 sm:size-20'>
        <Image
          src={image || '/images/default-avatar.png'}
          alt={fullName}
          width={80}
          height={80}
          className='size-16 rounded-full border-2 border-white/30 object-cover sm:size-20'
        />
        <div className='bg-success absolute right-1 bottom-1 size-5 rounded-full border-2 border-white/30' />
      </div>

      {/* Info */}
      <div className='flex-1'>
        <div>
          <h2 className='truncate text-lg font-bold text-white sm:text-xl'>
            {fullName}
          </h2>

          <p className='mb-2 text-sm text-white/80 sm:text-base'>
            {getText(role)}
          </p>
          {/* SUMMARY */}
          <p className='mb-3 line-clamp-2 text-xs leading-relaxed text-white/70 sm:text-sm'>
            {getText(summary)}
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex items-center gap-2 text-white/80'>
            <MapPin size={14} className='shrink-0 text-white/60' />
            <span className='truncate text-xs sm:text-sm'>
              {getText(address)}
            </span>
          </div>

          <div className='flex items-center gap-2 text-white/80'>
            <Calendar size={14} className='shrink-0 text-white/60' />
            <span className='text-xs sm:text-sm'>
              {birth_date
                ? new Date(birth_date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
