export const ProjectLoadingSkeleton = () => {
  return (
    <div className='rounded-lg border border-gray-600 bg-gray-700 p-6 shadow-lg'>
      <div className='mb-4 flex items-start justify-between'>
        <div className='h-7 w-24 animate-pulse rounded bg-gray-600' />
        <div className='h-7 w-16 animate-pulse rounded bg-gray-600' />
      </div>
      <div className='space-y-4'>
        {[1, 2].map(i => (
          <div
            key={i}
            className='animate-pulse rounded border border-gray-500 bg-gray-600 p-4'
          >
            <div className='mb-3 flex items-center gap-3'>
              <div className='size-10 rounded-full bg-gray-500' />
              <div className='h-5 w-32 rounded bg-gray-500' />
            </div>
            <div className='ml-13 space-y-2'>
              {[1, 2, 3].map(j => (
                <div key={j} className='flex items-center gap-2'>
                  <div className='size-6 rounded bg-gray-500' />
                  <div className='h-4 w-24 rounded bg-gray-500' />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
