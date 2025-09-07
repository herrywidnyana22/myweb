export default function Header() {
  return (
    <div className='absolute top-0 left-0 right-0 p-6'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <div className='text-2xl font-bold text-white'>Lovable</div>
        <div className='flex items-center space-x-4'>
          <button className='text-white/70 hover:text-white transition-colors'>
            Log in
          </button>
          <button className='bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm'>
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
