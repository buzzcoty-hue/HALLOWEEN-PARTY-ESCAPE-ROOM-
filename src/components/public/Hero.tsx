import React from 'react';
import { CLINIC_IMAGES } from '../../constants/images';
import { Calendar, Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';
import { ClinicSettings } from '../../types';

interface HeroProps {
  settings: ClinicSettings;
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookClick,
  onExploreServices,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Modern Gentle Healthcare · Precision Biomimetic Dentistry</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12] text-balance">
              Restoring healthy, radiant smiles in a serene medical setting.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
              Experience tranquil, patient-centered oral care powered by low-radiation 3D imaging,
              ultrasonic precision cleaning, and minimally invasive preventative dentistry.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onBookClick}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-md shadow-teal-600/20 transition-all flex items-center gap-2.5 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Your Visit</span>
              </button>
              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 text-sm sm:text-base font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                Explore Dental Services
              </button>
            </div>

            {/* Claim-to-Proof Adjacency Row */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 sm:gap-6 text-slate-800">
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-teal-700 tabular-nums">
                  4,800+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Happy Patients Treated
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums flex items-center gap-1">
                  4.95
                  <span className="text-amber-500 text-lg">★</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Verified Patient Rating
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  0%
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Rushed Appointments
                </div>
              </div>
            </div>
          </div>

          {/* Right Imagery (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative aura glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-teal-200/50 to-cyan-100/50 rounded-2xl blur-xl -z-10 opacity-70" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/60 bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={CLINIC_IMAGES.hero}
                  alt="Modern architectural interior of Aura Dental Studio treatment suite"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle bottom vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent pointer-events-none" />

                {/* In-photo trust label */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm flex items-center justify-between">
                  <span className="font-medium drop-shadow-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-300" />
                    Pristine Sterilization Protocol
                  </span>
                  <span className="text-slate-200 text-xs drop-shadow-sm">
                    Suite 1400 · Private Rooms
                  </span>
                </div>
              </div>

              {/* Floating Quality Tag */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-xl p-3.5 flex items-center gap-3 max-w-[260px]">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">ADA Accredited Practice</div>
                  <div className="text-[11px] text-slate-500">Board-certified dental surgeons</div>
                </div>
              </div>

              {/* Floating Quick Availability Tag */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Same-week slots available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
