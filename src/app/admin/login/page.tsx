'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, isLoading: authLoading, initialize, isInitialized } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && user) {
      if (user.isAdmin) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [user, isInitialized, router]);

  const onSubmit = async (values: LoginForm) => {
    setIsSubmitting(true);
    setError('');
    try {
      await login(values.email, values.password);
      // After login, useEffect above will redirect based on isAdmin
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (isInitialized && user)) {
    return (
      <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#4ade80] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1a0f] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1e3b26]/30 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#b08953]/15 blur-[120px] translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px'}} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e3b26] to-[#2d5a3d] border border-[#4ade80]/20 shadow-xl mb-4">
            <Leaf className="h-8 w-8 text-[#4ade80]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Rainbow <span className="text-[#b08953] font-serif italic font-normal">Admin</span></h1>
          <p className="text-sm text-white/40 mt-2">Secure administrative access portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Shield badge */}
          <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl bg-[#1e3b26]/40 border border-[#4ade80]/20 w-fit mx-auto">
            <Shield className="h-3.5 w-3.5 text-[#4ade80]" />
            <span className="text-xs font-bold text-[#4ade80] tracking-wider uppercase">Admin Access Required</span>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@rainbowenterprises.in"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#1e3b26] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#3d7a53] border border-[#4ade80]/20 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing In…</>
              ) : (
                <><Shield className="h-4 w-4" /> Sign In to Admin Panel</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-white/25">
              Mock credentials: <span className="text-white/40 font-mono">amit.sharma@example.com</span> / <span className="text-white/40 font-mono">password123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          © 2026 Rainbow Enterprises. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
