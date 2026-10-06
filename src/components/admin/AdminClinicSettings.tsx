import React, { useState } from 'react';
import { ClinicSettings } from '../../types';
import { Building2, Mail, Phone, MapPin, Clock, Check, AlertCircle, Save } from 'lucide-react';

interface AdminClinicSettingsProps {
  settings: ClinicSettings;
  onUpdateSettings: (settings: Partial<ClinicSettings>) => Promise<void>;
}

export const AdminClinicSettings: React.FC<AdminClinicSettingsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [clinicName, setClinicName] = useState(settings.clinic_name);
  const [clinicEmail, setClinicEmail] = useState(settings.clinic_email);
  const [clinicPhone, setClinicPhone] = useState(settings.clinic_phone);
  const [clinicAddress, setClinicAddress] = useState(settings.clinic_address);
  const [slotInterval, setSlotInterval] = useState(settings.slot_interval_minutes || 30);
  const [bookingNotice, setBookingNotice] = useState(settings.booking_notice_hours || 2);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state if props update
  React.useEffect(() => {
    setClinicName(settings.clinic_name);
    setClinicEmail(settings.clinic_email);
    setClinicPhone(settings.clinic_phone);
    setClinicAddress(settings.clinic_address);
    setSlotInterval(settings.slot_interval_minutes || 30);
    setBookingNotice(settings.booking_notice_hours || 2);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await onUpdateSettings({
        clinic_name: clinicName.trim(),
        clinic_email: clinicEmail.trim(),
        clinic_phone: clinicPhone.trim(),
        clinic_address: clinicAddress.trim(),
        slot_interval_minutes: Number(slotInterval),
        booking_notice_hours: Number(bookingNotice),
      });

      setSuccessMsg('Clinic settings updated and synchronized across website.');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Failed to update clinic settings:', err);
      setErrorMsg('Failed to update clinic settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Clinic Practice Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your clinic identity, contact channels, address, and booking interval rules.
          </p>
        </div>

        {successMsg && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Practice Identity Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Practice Identity & Public Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* clinic_name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Clinic Name *
              </label>
              <input
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Aura Dental Studio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              <span className="text-[11px] text-slate-400">
                Appears in header wordmark, hero title, confirmation emails, and footer.
              </span>
            </div>

            {/* clinic_email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Clinic Public Email *</span>
              </label>
              <input
                type="email"
                required
                value={clinicEmail}
                onChange={(e) => setClinicEmail(e.target.value)}
                placeholder="care@auradentalstudio.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            {/* clinic_phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Front Desk Phone *</span>
              </label>
              <input
                type="tel"
                required
                value={clinicPhone}
                onChange={(e) => setClinicPhone(e.target.value)}
                placeholder="+1 (555) 382-7200"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            {/* clinic_address */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Physical Clinic Address *</span>
              </label>
              <input
                type="text"
                required
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                placeholder="450 Sutter St, Suite 1400, San Francisco, CA 94108"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Scheduling Engine Rules */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Scheduling Engine Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* slot_interval_minutes */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Slot Interval Increment (Minutes)
              </label>
              <select
                value={slotInterval}
                onChange={(e) => setSlotInterval(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={15}>15 minutes (dense frequency)</option>
                <option value={30}>30 minutes (standard dental practice)</option>
                <option value={45}>45 minutes (medium blocks)</option>
                <option value={60}>60 minutes (hourly blocks)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Frequency at which new consultation start times can begin during working hours.
              </p>
            </div>

            {/* booking_notice_hours */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Minimum Advance Booking Notice (Hours)
              </label>
              <select
                value={bookingNotice}
                onChange={(e) => setBookingNotice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={1}>1 hour notice (immediate walk-in prep)</option>
                <option value={2}>2 hours notice (recommended standard)</option>
                <option value={4}>4 hours notice</option>
                <option value={12}>12 hours notice</option>
                <option value={24}>24 hours advance notice (next-day only)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Prevents patients from booking slots too close to the current time.
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 transition-all shadow-sm shadow-teal-600/25 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Clinic Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
