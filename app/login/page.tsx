'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12
                    bg-gradient-light dark:bg-gradient-dark">
      <div className="card w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 md:p-8 lg:p-12
                      min-h-[70vh] flex flex-col justify-center
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-lg">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="form-group">
            <label className="block font-semibold mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="user@company.com"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                         placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500
                         focus:ring-1 focus:ring-purple-200 dark:focus:ring-purple-900
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="block font-semibold mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                         placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500
                         focus:ring-1 focus:ring-purple-200 dark:focus:ring-purple-900
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-lg md:text-xl font-semibold"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm md:text-base">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-500 dark:text-primary-300 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'rgb(31 41 55)',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}
