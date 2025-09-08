import React from 'react';

export const PageTitle = () => {
  return (
    <header className='text-center px-2 sm:px-0'>
      <h1 className='text-3xl sm:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 text-white leading-tight sm:leading-snug lg:leading-[1.1]'>
        Herry{' '}
        <span className='relative'>
          Page
          <span className='absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-2xl sm:text-4xl'>✨</span>
        </span>
      </h1>

      {/* Subtitle */}
      <p className='text-base sm:text-lg lg:text-xl text-white/80 max-w-xl sm:max-w-2xl mx-auto mt-1 sm:mt-2 lg:mt-3'>
        Just a guy who loves coding & running 🏃‍♂️💻
      </p>
    </header>
  );
};
