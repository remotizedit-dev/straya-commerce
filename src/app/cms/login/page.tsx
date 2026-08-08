'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function CMSLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 🔒 STRICT PRODUCTION FIREBASE AUTHENTICATION (No hardcoded bypasses)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        sessionStorage.setItem('straya_cms_auth', 'true');
        router.push('/cms');
      }
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid admin credentials. Please verify your email and password in Firebase Console.');
      } else if (err.code === 'auth/invalid-api-key' || err.message?.includes('api-key')) {
        setError('Firebase API Key not configured. Please add your official SDK keys to .env.local.');
      } else {
        setError(err.message || 'Authentication failed. Please check your network and credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex items-center justify-center px-4 py-12 select-none">
      <div className="w-full max-w-md bg-[#0F1422] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF007A] to-[#00F0FF] p-0.5 mx-auto shadow-lg mb-3">
            <div className="w-full h-full bg-[#07090E] rounded-[14px] flex items-center justify-center text-white font-black text-2xl">
              S
            </div>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-white">
            STRAYA <span className="text-[#FF007A]">CMS PORTAL</span>
          </h2>
          <p className="text-xs text-[#00F0FF] font-bold">Secure Administrative Portal</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200 flex items-start space-x-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@yourdomain.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-[#FF007A]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full glow-pink-btn text-white font-black py-4 px-6 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Sign In To CMS Portal'}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            Protected by Firebase Authentication. Authenticate with your created Firebase admin account.
          </p>
        </div>
      </div>
    </div>
  );
}
