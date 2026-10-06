import React from 'react';
import { CLINIC_IMAGES } from '../../constants/images';
import { Cpu, Eye, Radio, Sparkles, Check } from 'lucide-react';

export const TechnologySection: React.FC = () => {
  return (
    <section id="technology" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Tech Features (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Precision Dentistry</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Hospital-grade imaging and gentle ultrasonic precision.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We replace uncomfortable traditional alginate impressions and noisy rotary drills with
              whisper-quiet digital intraoral scanners, laser gum contouring, and zero-radiation optical aids.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                  <Eye className="w-4 h-4" />
                  <span>3D Digital Intraoral Scans</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant millimeter-accurate color renders of your teeth without messy putty impressions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                  <Radio className="w-4 h-4" />
                  <span>Ultra-Low Dose Radiography</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Digital sensor plates that reduce radiation exposure by up to 85% compared to film.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                  <Cpu className="w-4 h-4" />
                  <span>Guided Bio-Polishing</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Warm erythritol powder streams that remove micro-plaques painlessly without scraping enamel.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                  <Check className="w-4 h-4" />
                  <span>Acoustic Comfort Tech</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Active noise-cancelling headphones and ceiling screens with soothing nature visuals in every suite.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Treatment Room Photo (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 aspect-[4/3]">
              <img
                src={CLINIC_IMAGES.treatmentSuite}
                alt="Aura Dental Studio precision operatory and treatment suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex items-center justify-between">
                <span>San Francisco Clinic · Private Operatory 3</span>
                <span className="text-teal-400 font-medium">Autoclave Monitored</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
