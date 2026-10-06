import React, { useState } from 'react';
import { ClinicSettings } from '../../types';
import { Calendar, Shield, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  settings: ClinicSettings;
  onBookClick: () => void;
  onAdminClick: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onBookClick,
  onAdminClick,
  isAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-teal-600/20">
            A
          </span>
          <span>{settings.clinic_name || 'Aura Dental Studio'}</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a
            href="#services"
            className="hover:text-teal-700 transition-colors whitespace-nowrap"
          >
            Services
          </a>
          <a
            href="#about"
            className="hover:text-teal-700 transition-colors whitespace-nowrap"
          >
            Clinical Philosophy
          </a>
          <a
            href="#technology"
            className="hover:text-teal-700 transition-colors whitespace-nowrap"
          >
            Technology
          </a>
          <a
            href="#booking"
            className="hover:text-teal-700 transition-colors whitespace-nowrap"
          >
            Appointments
          </a>
          <a
            href="#contact"
            className="hover:text-teal-700 transition-colors whitespace-nowrap"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAdminClick}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            title="Practice Administration Portal"
          >
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">{isAdmin ? 'Dashboard' : 'Staff Portal'}</span>
          </button>

          <button
            onClick={onBookClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm shadow-teal-600/25 transition-all whitespace-nowrap group"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 rounded-lg hover:bg-slate-50"
          >
            Services
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 rounded-lg hover:bg-slate-50"
          >
            Clinical Philosophy
          </a>
          <a
            href="#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 rounded-lg hover:bg-slate-50"
          >
            Technology
          </a>
          <a
            href="#booking"
            onClick={() => {
              setMobileMenuOpen(false);
              onBookClick();
            }}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 rounded-lg hover:bg-slate-50"
          >
            Appointments
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 rounded-lg hover:bg-slate-50"
          >
            Contact
          </a>
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg"
            >
              <Shield className="w-4 h-4 text-teal-600" />
              <span>{isAdmin ? 'Staff Dashboard' : 'Staff Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
