'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Spinner } from '@/components/ui';

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const { adminLogin } = useAdminAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');
      await adminLogin(data.email, data.password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white p-8 md:p-10 rounded-xl border border-border w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-brand-dark mb-1">IMISIOLUWA</h1>
          <p className="text-xs font-medium uppercase tracking-label text-gray-400">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brand-dark uppercase tracking-label mb-2">
              Email
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white text-brand-dark"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-danger">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark uppercase tracking-label mb-2">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white text-brand-dark"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-danger">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-brand hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-brand hover:text-brand-light text-xs uppercase tracking-label font-medium transition-colors">
            Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}
