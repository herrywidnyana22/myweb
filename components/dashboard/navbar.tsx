import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
    const { username, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    }

    return (
        <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    </div>
                <div className="flex items-center gap-6">
                    <span className="text-gray-300">Welcome, <span className="font-semibold text-white">{username}</span></span>
                        <button
                            onClick={handleLogout}
                            className="bg-error hover:bg-error-dark text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                        Logout
                    </button>
                </div>
                </div>
            </div>
        </nav>
    )
}
