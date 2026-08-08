'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { X, PhoneCall, CheckCircle2, ShieldCheck } from 'lucide-react';

export const RequestCallModal: React.FC = () => {
  const { isCallModalOpen, closeCallModal, addLead } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addLead({
        name,
        phone,
        email,
        source: 'call_request',
        message: 'Requested callback from Hero / Navbar quick trigger.',
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setPhone('');
        setEmail('');
        closeCallModal();
      }, 2500);
    } catch (err) {
      setError('Failed to submit callback request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCallModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-md bg-[#0D0D14] border border-[#FF007A]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,0,122,0.25)] text-white"
          >
            <button
              onClick={closeCallModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <CheckCircle2 className="w-16 h-16 text-[#00F0FF] mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                <p className="text-gray-300 text-sm">
                  Our Australian specialist will reach out to you within 30 minutes during business hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A]">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Request For A Call</h3>
                    <p className="text-xs text-[#00F0FF]">Speak with our Australian Peptide Specialists</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 text-xs text-red-400 bg-red-950/50 border border-red-800 rounded-lg p-2.5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Alex Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#151522] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Australian Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0412 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#151522] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@biotech-aus.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#151522] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full glow-pink-btn text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <PhoneCall className="w-4 h-4" />
                          <span>Submit Callback Request</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 text-center flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Strictly Confidential & Safe Australian Storage</span>
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
