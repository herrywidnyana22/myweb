'use client';

import useDataStore from '@/store/data';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Pagination } from 'swiper/modules';
import { ProjectItem } from './projectItem';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Projects = () => {
  const { getUIText } = useLocalizedText();
  const { projects, isLoading, error } = useDataStore();

  if (isLoading) {
    return (
      <Swiper
        grabCursor
        effect='creative'
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        modules={[EffectCreative, Pagination]}
        className='mySwiper h-full w-full overflow-hidden'
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <SwiperSlide key={i}>
            <div className='flex h-full w-full animate-pulse flex-col gap-3 rounded-2xl bg-white p-6'>
              <div className='flex items-center gap-3'>
                <div className='size-14 rounded-full bg-gray-300' />
                <div className='h-5 w-1/2 rounded bg-gray-300' />
              </div>
              <div className='mt-3 flex-1 space-y-3'>
                <div className='h-3 w-full rounded bg-gray-200' />
                <div className='h-3 w-5/6 rounded bg-gray-200' />
                <div className='h-3 w-4/5 rounded bg-gray-200' />
              </div>
              <div className='mt-5 flex justify-end gap-3'>
                <div className='h-6 w-20 rounded-2xl bg-gray-300' />
                <div className='h-6 w-24 rounded-2xl bg-gray-300' />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  if (error) {
    return (
      <p className='p-4 text-center text-red-400'>
        {getUIText('dataLoadFailed')}
      </p>
    );
  }

  if (!projects?.length) {
    return (
      <p className='p-4 text-center text-gray-100'>{getUIText('dataEmpty')}</p>
    );
  }

  return (
    <div className='relative h-full w-full'>
      <Swiper
        grabCursor
        effect='creative'
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        pagination={{
          clickable: true,
          el: '.project-pagination',
        }}
        modules={[EffectCreative, Pagination]}
        className='mySwiper h-full w-full overflow-hidden'
      >
        {(Array.isArray(projects) ? projects : []).map((project, i) => (
          <SwiperSlide key={i}>
            <ProjectItem {...project} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='project-pagination mt-4 mb-1 flex w-full justify-center' />
    </div>
  );
};
