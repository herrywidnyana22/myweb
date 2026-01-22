'use client';

import useDataStore from '@/store/data';

import { SwiperSlide, Swiper } from 'swiper/react';
import { EffectCreative, Pagination } from 'swiper/modules';
import { ExperienceCard } from '../card/experienceCard';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Experiences = () => {
  const { experiences, isLoading, error } = useDataStore();
  const { getUIText } = useLocalizedText();

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
        className='mySwiper relative h-full w-full pb-10'
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <SwiperSlide key={i}>
            <div className='flex h-full w-full animate-pulse overflow-hidden rounded-2xl bg-white shadow-md'>
              {/* Left icon section */}
              <div className='flex w-8 items-center justify-center bg-gray-300 sm:w-12' />

              {/* Right content skeleton */}
              <div className='flex w-full flex-col gap-3 p-4 sm:p-6 md:p-8'>
                <div className='flex items-center justify-between'>
                  <div className='h-4 w-1/2 rounded bg-gray-300' />
                  <div className='h-3 w-12 rounded bg-gray-200' />
                </div>
                <div className='mt-2 flex flex-col gap-2'>
                  <div className='h-3 w-2/3 rounded bg-gray-300' />
                  <div className='h-3 w-5/6 rounded bg-gray-200' />
                  <div className='h-3 w-3/4 rounded bg-gray-200' />
                </div>
                <div className='mt-4 flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full bg-gray-300' />
                  <div className='h-3 w-1/3 rounded bg-gray-200' />
                </div>
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

  if (!experiences?.length) {
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
          el: '.experience-pagination',
        }}
        modules={[EffectCreative, Pagination]}
        className='mySwiper h-full w-full overflow-hidden'
      >
        {experiences.map((project, i) => (
          <SwiperSlide key={i}>
            <ExperienceCard {...project} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='experience-pagination mt-4 mb-1 flex w-full justify-center' />
    </div>
  );
};
