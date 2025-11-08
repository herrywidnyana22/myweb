'use client';

import Image from 'next/image';
import { useData } from '@/lib/useData';

export const Education = () => {
  const { data, isLoading, error } = useData<EducationProps>('educations');

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:gap-6 gap-4 p-4 sm:p-6 place-items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 animate-pulse"
          >
            <div className="relative flex items-center justify-center size-14 sm:size-16 bg-gray-300 rounded-full" />
            <div className="h-2 w-20 bg-gray-300 rounded" />
            <div className="h-2 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 p-4">Gagal memuat data pendidikan.</p>;
  }

  if (!data?.length) {
    return <p className="text-center text-gray-400 p-4">Belum ada data pendidikan.</p>;
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <div
        className="
          grid grid-cols-2 sm:flex sm:flex-row 
          items-start justify-center 
          gap-6 sm:gap-10 px-4 sm:px-6 py-6 sm:py-8
        "
      >
        {data.map((edu, i) => (
          <div
            key={i}
            className="
              relative flex flex-col items-center text-center 
              w-full sm:w-auto
            "
          >
            {/* Icon utama */}
            <div
              className="
                relative flex items-center justify-center 
                size-14 sm:size-16 
                bg-white rounded-full border-2 border-orange-400 
                shadow-md
              "
            >
              {typeof edu.icon === 'string' && (
                <Image
                  src={edu.icon}
                  alt={edu.school}
                  width={36}
                  height={36}
                  className="object-contain size-8 sm:size-10"
                />
              )}
              {typeof edu.subIcon === 'string' && (
                <Image
                  src={edu.subIcon}
                  alt="graduation"
                  width={16}
                  height={16}
                  className="absolute bottom-0 right-0 size-4 sm:size-5 object-contain"
                />
              )}
            </div>

            {/* Garis penghubung (Desktop only) */}
            {i < data.length - 1 && (
              <div className="hidden sm:block absolute top-8 left-[calc(100%-2rem)] h-0.5 w-20 sm:w-24 bg-linear-to-r from-primary to-yellow-400" />
            )}

            {/* Info pendidikan */}
            <div className="mt-3 w-36 sm:w-44">
              <h3 className="font-bold text-xs sm:text-sm md:text-base text-primary uppercase leading-tight">
                {edu.school}
              </h3>
              <p className="text-neutral-300 text-[11px] sm:text-xs mt-1 leading-snug">
                {edu.major}
              </p>
              <p className="text-neutral-400 text-[10px] sm:text-xs mt-0.5">
                {edu.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
