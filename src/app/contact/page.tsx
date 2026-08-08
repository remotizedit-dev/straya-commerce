'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { siteSettings, addLead } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setError('Please fill in all contact fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addLead({
        name,
        email,
        phone,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FF007A]/10 text-[#FF007A] text-xs font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Australian Support Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Contact Straya Peptides
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Have questions regarding HPLC batch verification, custom laboratory orders, or dispatch tracking? Our Sydney and Melbourne teams are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-4">
                Direct Australian Contact
              </h3>

              <div className="space-y-5 text-sm text-slate-700">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-[#FF007A]/10 text-[#FF007A] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Laboratory Headquarters</h4>
                    <p className="text-xs text-slate-500 mt-1">{siteSettings.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-[#FF007A]/10 text-[#FF007A] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Telephone Support</h4>
                    <p className="text-xs text-[#FF007A] font-mono font-bold mt-1">{siteSettings.contactPhone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-[#FF007A]/10 text-[#FF007A] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email Desk</h4>
                    <p className="text-xs text-slate-500 mt-1">{siteSettings.contactEmail}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-[#FF007A]/10 text-[#FF007A] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Business Hours</h4>
                    <p className="text-xs text-slate-500 mt-1">{siteSettings.businessHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {siteSettings.mapEmbedUrl && (
              <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-72 w-full">
                <iframe
                  src={siteSettings.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Straya Location Map"
                />
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#FF007A] animate-bounce" />
                <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm">
                  Your message has been logged directly into our CMS inquiry desk. We will respond via email or phone shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="glow-pink-btn text-white text-xs font-bold px-6 py-3 rounded-xl mt-4 cursor-pointer"
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                    Send Us A Message
                  </h3>
                  <p className="text-xs text-[#FF007A] font-bold">Submissions are stored securely in CMS</p>
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
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
                    rows={4}
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
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to CMS</span>
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
