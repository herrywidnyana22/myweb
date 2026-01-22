export const ProfileLoadingSkeleton = () => {
  return (
    <div className='rounded-lg border border-gray-600 bg-gray-700 p-6 shadow-lg'>
      <div className='mb-4 flex items-start justify-between'>
        <div className='h-7 w-20 animate-pulse rounded bg-gray-600' />
        <div className='h-7 w-16 animate-pulse rounded bg-gray-600' />
      </div>
      <div className='space-y-3'>
        {[1, 2].map(i => (
          <div
            key={i}
            className='animate-pulse rounded border border-gray-500 bg-gray-600 p-3'
          >
            <div className='mb-2 flex items-start justify-between'>
              <div className='h-9 w-9 rounded-2xl bg-gray-500' />
              <div className='ml-2 flex-1'>
                <div className='mb-2 h-4 w-32 rounded bg-gray-500' />
                <div className='h-3 w-24 rounded bg-gray-500' />
              </div>
              <div className='h-6 w-12 rounded bg-gray-500' />
            </div>
            <div className='mb-1 h-3 w-full rounded bg-gray-500' />
            <div className='h-3 w-20 rounded bg-gray-500' />
          </div>
        ))}
      </div>
    </div>
  );
};
