import Image from 'next/image';
import { useState } from 'react';

export const FlagIcon = ({ code, size = 20, flagCode }: FlagIconProps) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className='flex cursor-pointer items-center justify-center rounded-sm bg-gray-200 px-1.5 py-1 text-gray-900 transition'
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {flagCode}
      </div>
    );
  }

  return (
    <div className='cursor-pointer rounded-sm p-1 text-gray-900 transition hover:bg-gray-200'>
      <Image
        src={`https://flagcdn.com/w${size}/${code}.png`}
        alt={code}
        width={size}
        height={size}
        className='h-3 w-4.5 rounded-sm object-cover'
        onError={() => setError(true)}
      />
    </div>
  );
};
