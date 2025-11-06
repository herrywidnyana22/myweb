'use client';

import Image from 'next/image';
import { useData } from '@/lib/useData';

export const Education = () => {
  const { data, isLoading, error } = useData<EducationProps>('educations');

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 overflow-x-auto p-4 sm:p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 animate-pulse"
          >
            <div className="relative flex items-center justify-center size-16 bg-gray-300 rounded-full" />
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
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
      <div className="flex w-full items-start justify-center gap-10 px-4 sm:px-6 py-8">
        {data.map((edu, i) => (
          <div key={i} className="relative flex flex-col items-center text-center">
            {/* Icon utama */}
            <div className="relative flex items-center justify-center size-16 bg-white rounded-full border-2 border-orange-400 shadow-md">
              {typeof edu.icon === 'string' && (
                  <Image
                    src={edu.icon}
                    alt={edu.school}
                    width={40}
                    height={40}
                    className="object-contain size-10"
                  />
                )

              }
              {typeof edu.subIcon === 'string' && (
                <Image
                  src={edu.subIcon}
                  alt="graduation"
                  width={20}
                  height={20}
                  className="absolute bottom-0 right-0 size-5 object-contain"
                />
              )}
            </div>

            {/* Garis penghubung */}
            {i < data.length - 1 && (
              <div className="absolute h-0.5 w-24 top-8 left-[calc(100%-3rem)] sm:w-32 bg-linear-to-r from-orange-500 to-yellow-400" />
            )}

            {/* Info pendidikan */}
            <div className="mt-3 w-40 sm:w-48">
              <h3 className="font-bold text-sm sm:text-base text-orange-500 uppercase">
                {edu.school}
              </h3>
              <p className="text-neutral-300 text-xs sm:text-sm mt-1">
                {edu.major}
              </p>
              <p className="text-neutral-200 text-xs mt-0.5">{edu.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
