'use client';

import { SwiperSlide, Swiper } from "swiper/react";
import { EffectCreative, Pagination } from "swiper/modules";
import { ExperienceCard } from './card/experienceCard';
import { useData } from "@/hooks/useData";

export const Experiences = () => {
  const { data, isLoading, error } = useData<ExperienceProps>('experiences');

  if (isLoading) {
    return (
      <Swiper
        grabCursor={true}
        effect={'creative'}
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        modules={[EffectCreative, Pagination]}
        className="mySwiper w-full h-full relative pb-10"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <SwiperSlide key={i}>
            <div className="flex w-full h-full rounded-2xl overflow-hidden shadow-md bg-white animate-pulse">
              {/* Left icon section */}
              <div className="flex items-center justify-center w-8 sm:w-12 bg-gray-300" />

              {/* Right content skeleton */}
              <div className="w-full flex flex-col p-4 sm:p-6 md:p-8 gap-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-1/2 bg-gray-300 rounded" />
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="h-3 w-2/3 bg-gray-300 rounded" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <div className="h-3 w-3 bg-gray-300 rounded-full" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 p-4">Gagal memuat pengalaman.</p>;
  }

  if (!data?.length) {
    return <p className="text-center text-gray-400 p-4">Belum ada data pengalaman.</p>;
  }

  return (
    <div className="relative w-full h-full">
      <Swiper
        grabCursor
        effect="creative"
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        pagination={{
          clickable: true,
          el: '.experience-pagination',
        }}
        modules={[EffectCreative, Pagination]}
        className="mySwiper w-full h-full overflow-hidden"
      >
        {data.map((project, i) => (
          <SwiperSlide key={i}>
            <ExperienceCard {...project} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="experience-pagination mt-4 mb-1 flex justify-center w-full" />
    </div>
  );
};
