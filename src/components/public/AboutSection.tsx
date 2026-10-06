import React from 'react';
import { CLINIC_IMAGES } from '../../constants/images';
import { CheckCircle, Shield, HeartPulse, UserCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column: Visual Storytelling (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 aspect-[4/3] sm:aspect-[1/1]">
                <img
                  src={CLINIC_IMAGES.about}
                  alt="Doctor consulting transparently with patient at Aura Dental Studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Quote Card */}
              <div className="mt-4 sm:-mt-10 sm:ml-6 relative z-10 bg-slate-900 text-white p-5 rounded-2xl shadow-xl max-w-sm">
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  "Our philosophy is simple: we never rush a consultation. You will always know what
                  we recommend, why it matters, and every option available."
                </p>
                <div className="mt-3 text-xs font-semibold text-teal-300">
                  Dr. Evelyn Vance, DDS, FAGD · Clinical Director
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="text-xs font-bold tracking-wider text-teal-700 uppercase">
                Clinical Philosophy
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                Dentistry reimagined around comfort, transparency, and calm.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                We believe that dental visits should never be a source of stress or ambiguity. At Aura
                Dental Studio, we blend hospital-grade sterilization standards with a serene,
                architectural environment designed to put every patient immediately at ease.
              </p>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Hospital-Grade Air & Surface Hygiene</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Medical Surgically Clean Air filtration units and autoclave-monitored sterilization in every suite.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Gentle & Pain-Free Techniques</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pre-warmed local anesthesia and computer-controlled gentle delivery ensure minimal sensation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Conservative Biomimetic Approach</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We prioritize tooth-preserving bonding and preventative care, avoiding unnecessary drilling or crowns.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Upfront Price Transparency</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear itemized estimates before treatment. No hidden add-ons or unexpected post-visit bills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
