import React from 'react';

export const PageTitle = () => {
  return (
    <header className='text-center'>
      <h1 className='text-4xl md:text-6xl font-bold mb-6 text-white'>
        Herry{' '}
        <span className='relative'>
          Page
          <span className='absolute -top-2 -right-2 text-4xl'>✨</span>
        </span>
      </h1>

      {/* Subtitle */}
      <p className='text-xl text-white/80 max-w-2xl mx-auto'>
        Just a guy who loves coding & running 🏃‍♂️💻
      </p>
    </header>
  );
};
