'use client'

import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import { useData, useSingleData } from '@/hooks/useData';
import { Highlight } from './highlight';
import { useApp } from '@/context/AppContextProps';

export const Profile = () => {
  const { data: profileData, isLoading: loadingProfile, error: errorProfile } = useSingleData<ProfileProps>('profile');
  const { data: addressData, isLoading: loadingAddress, error: errorAddress } = useSingleData<AddressProps>('address');
  const { data: highlightData, isLoading: loadingHighlight } = useData<HighlightProps>('highlight');

  const { ui } = useApp()

  if (loadingProfile || loadingAddress || loadingHighlight) {
    return (
      <div className="relative flex items-center gap-4 p-4 animate-pulse">
        <div className='absolute flex gap-2 top-2 right-2'>
          <div className="size-8 bg-gray-700 rounded" />
          <div className="size-8 bg-gray-700 rounded" />
        </div>
        <div className="size-20 bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-700 rounded w-1/3" />
          <div className="h-3 bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    );
  }

  
  if (errorProfile || errorAddress) {
    return <p className="text-center text-red-400 p-4">{ui.dataLoadFailed}</p>;
  }

  if (!profileData || !addressData) {
    return <p className="text-center text-gray-400 p-4">{ui.dataEmpty}</p>;
  }
  
  const { fullName, role, summary, image, birth_date } = profileData;
  const { address } = addressData;
  
  return (
    <div className="relative flex gap-4 p-4 sm:p-6 overflow-hidden">
      {/* Foto profil */}
      <div className='absolute flex gap-2 top-2 right-2'>
        {
          highlightData.map((item, i) => (
            <Highlight
              key={i}
              title={item.title}
              label={item.label}
            />
          ))
        }
      </div>
      <div className="relative size-16 sm:size-20">
        <Image
          src={image}
          alt={fullName}
          width={80}
          height={80}
          className="size-16 sm:size-20 rounded-full object-cover border-2 border-white/30"
        />
        <div className="absolute bottom-1 right-1 size-5 bg-success rounded-full border-2 border-white/30" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">{fullName}</h2>
          <p className="text-sm sm:text-base text-white/80 mb-3">{role}</p>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2 mb-3">
            {summary}
          </p>

        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin size={14} className="text-white/60 shrink-0" />
            <span className="text-xs sm:text-sm truncate">{address}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Calendar size={14} className="text-white/60 shrink-0" />
            <span className="text-xs sm:text-sm">
              {new Date(birth_date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
    
  );
};
