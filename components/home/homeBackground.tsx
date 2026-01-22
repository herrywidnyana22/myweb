'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const WALLPAPERS = [
  '/wallpaper/wallpaper-1.jpg',
  '/wallpaper/wallpaper-2.jpeg',
  '/wallpaper/wallpaper-3.jpg',
  '/wallpaper/wallpaper-4.jpeg',
  '/wallpaper/wallpaper-5.jpeg',
  '/wallpaper/wallpaper-6.jpg',
];

const MIN_INTERVAL = 3 * 60 * 1000; // 3 minutes
const MAX_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const BackgroundHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const getRandomInterval = () => {
      return (
        Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) +
        MIN_INTERVAL
      );
    };

    const changeWallpaper = () => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % WALLPAPERS.length);
        setIsVisible(true);
      }, 500); // Wait for fade out
    };

    const intervalId = setInterval(changeWallpaper, getRandomInterval());

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <Image
          src={WALLPAPERS[currentIndex]}
          alt='Background wallpaper'
          fill
          priority
          quality={90}
          className={`object-cover transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      {/* background GRADIENT ONLY */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-purple-900/60 to-[--color-primary-hover]/60 -z-10" />
            <div className="absolute inset-0 bg-black/30 -z-10" /> */}
    </>
  );
};
