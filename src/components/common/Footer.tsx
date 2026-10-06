import React from 'react';
import { ClinicSettings, BusinessHours } from '../../types';
import { Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';

interface FooterProps {
  settings: ClinicSettings;
  businessHours: BusinessHours[];
  onAdminClick: () => void;
  onBookClick: () => void;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const Footer: React.FC<FooterProps> = ({
  settings,
  businessHours,
  onAdminClick,
  onBookClick,
}) => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                A
              </span>
              <span>{settings.clinic_name || 'Aura Dental Studio'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Dedicated to compassionate, minimally invasive dentistry. Providing dental checkups,
              cleanings, whitening, and restorative care in an architectural, calm atmosphere.
            </p>
            <div className="pt-1">
              <button
                onClick={onBookClick}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors"
              >
                Schedule Consultation
              </button>
            </div>
          </div>

          {/* Col 2: Clinic Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Practice Information
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{settings.clinic_address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{settings.clinic_phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{settings.clinic_email}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Operating Hours</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              {businessHours.map((bh) => (
                <div key={bh.id} className="flex justify-between py-0.5 border-b border-slate-800/60">
                  <span className="font-medium text-slate-300">{WEEKDAY_NAMES[bh.weekday]}</span>
                  <span className="tabular-nums">
                    {bh.is_open
                      ? `${bh.start_time.slice(0, 5)} – ${bh.end_time.slice(0, 5)}`
                      : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Quick Navigation & Staff */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Practice Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">
                  Dental Care Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-teal-400 transition-colors">
                  Clinical Standards & Ethics
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-teal-400 transition-colors">
                  In-Office Technology
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-teal-400 transition-colors">
                  Online Appointment Booking
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={onAdminClick}
                  className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Clinical Staff & Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.clinic_name || 'Aura Dental Studio'}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>HIPAA Compliant Data Standards</span>
            <span>·</span>
            <span>American Dental Association Member</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
