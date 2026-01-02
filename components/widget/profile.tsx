'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useAppStore } from '@/store/app';

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function readCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (err) {
    console.error(`Failed to read cache "${key}":`, err);
    return null;
  }
}

function writeCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    console.error(`Failed to write cache "${key}":`, err);
  }
}

export const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileProps | null>(null);
  const [addressData, setAddressData] = useState<AddressProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ui } = useAppStore()

  // Fetch profile data (includes address)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Check cache first
        const cachedProfile = readCache<ProfileProps>('profile_cache');
        const cachedAddress = readCache<AddressProps>('address_cache');
        
        if (cachedProfile && cachedAddress) {
          setProfileData(cachedProfile);
          setAddressData(cachedAddress);
          setIsLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch('/api/profiles');
        if (!response.ok) throw new Error('Failed to fetch profile');

        const profiles = (await response.json()) as any[];
        if (!profiles || profiles.length === 0) {
          throw new Error('No profile found');
        }

        // Format the first profile to match component expectations
        const raw = profiles[0];
        const profileData: ProfileProps = {
          name: raw.name,
          fullName: raw.fullName,
          role: raw.role,
          summary: raw.description,
          image: raw.photoURL,
          birth_date: raw.birthDate,
          birth_place: raw.birthPlace,
        };

        const addressData: AddressProps = {
          address: raw.address,
          lat: raw.lat,
          lng: raw.lng,
          mapUrl: raw.mapURL,
        };

        setProfileData(profileData);
        setAddressData(addressData);
        
        // Cache both
        writeCache('profile_cache', profileData);
        writeCache('address_cache', addressData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
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

  if (error) {
    return <p className="text-center text-red-400 p-4">{ui.dataLoadFailed}</p>;
  }

  if (!profileData || !addressData) {
    return <p className="text-center text-gray-400 p-4">{ui.dataEmpty}</p>;
  }
  
  const { fullName, role, summary, image, birth_date } = profileData;
  const { address } = addressData;
  
  return (
    <div className="relative flex gap-4 p-4 sm:p-6 overflow-hidden">

      {/* Foto */}
      <div className="relative size-16 sm:size-20">
        <Image
          src={image || '/images/default-avatar.png'}
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

          <h2 className="text-lg sm:text-xl font-bold text-white truncate">
            {fullName}
          </h2>

          <p className="text-sm sm:text-base text-white/80 mb-2">
            {role}
          </p>
          {/* SUMMARY */}
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
              {birth_date ? new Date(birth_date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

};
