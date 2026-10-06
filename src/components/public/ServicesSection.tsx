import React from 'react';
import { Service } from '../../types';
import { CLINIC_IMAGES } from '../../constants/images';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
}) => {
  // Only display active services
  const activeServices = services.filter((s) => s.is_active);

  // Map contextual imagery to services
  const getServiceImage = (index: number) => {
    if (index % 2 === 0) return CLINIC_IMAGES.smileCare;
    return CLINIC_IMAGES.treatmentSuite;
  };

  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <div className="text-xs font-bold tracking-wider text-teal-700 uppercase">
            Specialized Care & Treatments
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            Comprehensive dentistry with an emphasis on comfort and longevity.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Every procedure is planned with digital precision, high-magnification optics, and
            biocompatible materials to preserve your natural tooth structure.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, index) => {
            const cardImg = getServiceImage(index);

            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cardImg}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />

                  {/* Price & Duration overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/25">
                      <Clock className="w-3.5 h-3.5 text-teal-300" />
                      <span>{service.duration_minutes} mins</span>
                    </span>
                    <span className="text-base font-bold text-white tabular-nums">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Highlights / Care Guarantee */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Single-visit digital charting & follow-up plan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Direct insurance claim assistance</span>
                    </div>
                  </div>

                  {/* Booking Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectService(service)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-teal-800 bg-teal-50 group-hover:bg-teal-600 group-hover:text-white border border-teal-200/70 group-hover:border-transparent transition-all flex items-center justify-center gap-2"
                    >
                      <span>Select Service & Book</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-14 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Not sure which appointment type suits your current dental health?
            </h4>
            <p className="text-sm text-slate-600">
              Select our Comprehensive Dental Examination — our clinicians conduct an initial evaluation
              and present all options before any procedure begins.
            </p>
          </div>
          <button
            onClick={() => {
              const exam = activeServices.find((s) => s.name.toLowerCase().includes('examination')) || activeServices[0];
              if (exam) onSelectService(exam);
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg whitespace-nowrap border border-teal-200/80 transition-colors"
          >
            Book Initial Examination
          </button>
        </div>
      </div>
    </section>
  );
};
