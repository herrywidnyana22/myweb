'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithToken, verifySession } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user already has a valid session
  useEffect(() => {
    const checkSession = async () => {
      const isValid = await verifySession();
      if (isValid) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router, verifySession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = (await res.json()) as { username: string; token: string };
        loginWithToken(data.username, data.token);
        router.push('/dashboard');
      } else {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || 'Invalid username or password');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-500 to-purple-600'>
        <div className='text-lg text-white'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 px-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-2xl'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-800'>Login</h1>
          <p className='text-gray-600'>
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='text-error rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm'>
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor='username'
              className='mb-2 block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder='Enter your username'
              disabled={isLoading}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 text-neutral-600 transition outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50'
              required
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='mb-2 block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Enter your password'
              disabled={isLoading}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 text-neutral-600 transition outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400'
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
