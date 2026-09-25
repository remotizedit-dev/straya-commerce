'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Mail, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { addLead } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addLead({
        name,
        email,
        phone: phone.trim() || undefined,
        source: 'contact_form',
        message,
      });
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FF007A]/10 text-[#FF007A] text-xs font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Australian Support Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Contact Straya Peptides
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            For general enquiries, our team is here to assist.
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong className="font-bold text-amber-800">Please note:</strong> Personal use, dosing, or medical guidance enquiries cannot be addressed.
            </span>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#FF007A] animate-bounce" />
                <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm">
                  Your message has been logged directly into our inquiry desk. We will respond via email shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="glow-pink-btn text-white text-xs font-bold px-6 py-3 rounded-xl mt-4 cursor-pointer"
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                    Send Us A Message
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill out the form below and our team will get back to you promptly.
                  </p>
                </div>

                {error && (
                  <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harrison Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="harrison@biotech.com.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="0412 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message / Inquiry *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Enter details regarding compound orders or HPLC reports..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glow-pink-btn text-white font-black py-4 px-6 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
