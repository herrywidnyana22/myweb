'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Pagination } from 'swiper/modules';
import { ProjectItem } from './projectItem';
import { useData } from '@/hooks/useData';
import { useAppStore } from '@/store/app';

export const Projects = () => {
  const { data, isLoading, error } = useData<ProjectProps>('projects');
  const { ui } = useAppStore()
  console.log({data})
  
  if (isLoading) {
    return (
      <Swiper
        grabCursor
        effect="creative"
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        modules={[EffectCreative, Pagination]}
        className="mySwiper w-full h-full overflow-hidden"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-full flex flex-col gap-3 p-6 rounded-2xl bg-white animate-pulse">
              <div className="flex items-center gap-3">
                <div className="rounded-full size-14 bg-gray-300" />
                <div className="h-5 w-1/2 bg-gray-300 rounded" />
              </div>
              <div className="flex-1 mt-3 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <div className="h-6 w-20 bg-gray-300 rounded-2xl" />
                <div className="h-6 w-24 bg-gray-300 rounded-2xl" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

   if (error) {
    return <p className="text-center text-red-400 p-4">{ui.dataLoadFailed}</p>;
  }

  if (!data?.length) {
    return <p className="text-center text-gray-400 p-4">{ui.dataEmpty}</p>;
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
          el: '.project-pagination',
        }}
        modules={[EffectCreative, Pagination]}
        className="mySwiper w-full h-full overflow-hidden"
      >
        {data.map((project, i) => (
          <SwiperSlide key={i}>
            <ProjectItem {...project} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="project-pagination mt-4 mb-1 flex justify-center w-full" />
    </div>
  );
};

