import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { username, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className='border-b border-gray-700 bg-gray-800 shadow-lg'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold text-white'>Dashboard</h1>
          </div>
          <div className='flex items-center gap-6'>
            <span className='text-gray-300'>
              Welcome,{' '}
              <span className='font-semibold text-white'>{username}</span>
            </span>
            <button
              onClick={handleLogout}
              className='bg-error hover:bg-error-dark rounded-lg px-4 py-2 font-semibold text-white transition duration-200'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
