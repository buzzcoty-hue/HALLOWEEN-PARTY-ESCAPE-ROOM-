import React, { useState, useMemo } from 'react';
import {
  Service,
  ClinicSettings,
  BusinessHours,
  BlockedDate,
  Appointment,
  TimeSlot,
} from '../../types';
import {
  generateAvailableSlots,
  formatDateKey,
} from '../../lib/availability';
import { createAppointment } from '../../lib/dentalApi';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  User,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Building2,
  CalendarCheck,
} from 'lucide-react';

interface BookingSectionProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  settings: ClinicSettings;
  businessHours: BusinessHours[];
  blockedDates: BlockedDate[];
  appointments: Appointment[];
  onAppointmentCreated: (newApt: Appointment) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  selectedService,
  onSelectService,
  settings,
  businessHours,
  blockedDates,
  appointments,
  onAppointmentCreated,
}) => {
  // Steps: 1 = Service, 2 = Date & Time, 3 = Details, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(selectedService ? 2 : 1);

  // Active services only
  const activeServices = useMemo(() => services.filter((s) => s.is_active), [services]);

  // Selected Date (default to tomorrow or nearest upcoming open day)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Selected slot
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Generate next 21 selectable days for clean UX
  const availableDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 24; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  // Compute available slots whenever selectedDate or selectedService changes
  const availability = useMemo(() => {
    if (!selectedService) {
      return { slots: [], isBlocked: false, isClosedDay: false };
    }

    return generateAvailableSlots({
      targetDate: selectedDate,
      service: selectedService,
      businessHours,
      blockedDates,
      existingAppointments: appointments,
      settings,
      now: new Date(),
    });
  }, [selectedDate, selectedService, businessHours, blockedDates, appointments, settings]);

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    onSelectService(service);
    setSelectedSlot(null);
    setCurrentStep(2);
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  // Handle Booking submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedService) {
      setSubmitError('Please select a dental service.');
      return;
    }

    if (!selectedSlot) {
      setSubmitError('Please choose an available appointment time slot.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setSubmitError('Please fill in your name, email, and contact number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dateString = formatDateKey(selectedDate);
      const newAppointment = await createAppointment({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service_id: selectedService.id,
        appointment_date: dateString,
        start_time: selectedSlot.timeString,
        end_time: selectedSlot.endTimeString,
        status: 'pending',
        notes: notes.trim() || null,
      });

      // Augment with service details for the confirmation card
      newAppointment.service = selectedService;
      setConfirmedAppointment(newAppointment);
      onAppointmentCreated(newAppointment);
      setCurrentStep(4);
    } catch (err) {
      console.error('Error submitting appointment:', err);
      setSubmitError('Unable to schedule appointment. Please try again or call our front desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset booking to start over
  const handleBookAnother = () => {
    setSelectedSlot(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setConfirmedAppointment(null);
    setCurrentStep(1);
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-slate-50 via-teal-50/20 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold tracking-wider text-teal-700 uppercase">
            Online Scheduling
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Book your appointment in minutes.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Real-time availability directly synchronized with our clinic schedule. No waiting on hold.
          </p>
        </div>

        {/* Step Indicator Header (if not on confirmation step) */}
        {currentStep < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-xl mx-auto relative">
              {/* Connector line */}
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />

              {/* Step 1 */}
              <button
                onClick={() => setCurrentStep(1)}
                className={`relative z-10 flex flex-col items-center gap-1.5 focus:outline-none`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 1
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-sm'
                      : currentStep > 1
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  1
                </div>
                <span className={`text-xs font-semibold ${currentStep === 1 ? 'text-teal-900' : 'text-slate-500'}`}>
                  Service
                </span>
              </button>

              {/* Step 2 */}
              <button
                onClick={() => selectedService && setCurrentStep(2)}
                disabled={!selectedService}
                className={`relative z-10 flex flex-col items-center gap-1.5 focus:outline-none ${
                  !selectedService ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 2
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-sm'
                      : currentStep > 2
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  2
                </div>
                <span className={`text-xs font-semibold ${currentStep === 2 ? 'text-teal-900' : 'text-slate-500'}`}>
                  Date & Time
                </span>
              </button>

              {/* Step 3 */}
              <button
                onClick={() => selectedSlot && setCurrentStep(3)}
                disabled={!selectedSlot}
                className={`relative z-10 flex flex-col items-center gap-1.5 focus:outline-none ${
                  !selectedSlot ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 3
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-sm'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  3
                </div>
                <span className={`text-xs font-semibold ${currentStep === 3 ? 'text-teal-900' : 'text-slate-500'}`}>
                  Patient Info
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 transition-all">
          {/* ================= STEP 1: SELECT SERVICE ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Step 1: Choose Your Dental Service</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select the care you require. Duration and preparation will be calculated automatically.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeServices.map((service) => {
                  const isSelected = selectedService?.id === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceSelect(service)}
                      className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-md'
                          : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-base text-slate-900 leading-snug">
                            {service.name}
                          </h4>
                          <span className="font-bold text-slate-900 tabular-nums shrink-0 text-sm">
                            ${Number(service.price).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {service.duration_minutes} minutes
                        </span>
                        <span className={`font-semibold ${isSelected ? 'text-teal-700' : 'text-slate-400'}`}>
                          {isSelected ? 'Selected ✓' : 'Select'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedService && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-2 text-sm shadow-md shadow-teal-600/20"
                  >
                    <span>Proceed to Date & Time</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: SELECT DATE & TIME ================= */}
          {currentStep === 2 && selectedService && (
            <div className="space-y-8">
              {/* Selected Service Recap */}
              <div className="bg-teal-50/60 border border-teal-200/70 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {selectedService.duration_minutes}m
                  </div>
                  <div>
                    <div className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                      Selected Service
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                      {selectedService.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline whitespace-nowrap"
                >
                  Change
                </button>
              </div>

              {/* Day Selection Bar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-teal-600" />
                    <span>Select Appointment Date</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    Showing next 24 days
                  </span>
                </div>

                {/* Horizontal scrollable date pills */}
                <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                  {availableDays.map((date) => {
                    const isSelected =
                      formatDateKey(date) === formatDateKey(selectedDate);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        className={`min-w-[84px] py-3 px-2 rounded-xl border text-center transition-all shrink-0 ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`text-[11px] font-semibold uppercase ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                          {dayName}
                        </div>
                        <div className="text-sm font-bold mt-0.5">
                          {monthDay}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Slots Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>
                      Available Times for{' '}
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    {availability.slots.length} slots found
                  </span>
                </div>

                {/* State: Blocked date */}
                {availability.isBlocked && (
                  <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Practice Closed on this Date</div>
                      <div className="text-xs text-amber-700 mt-0.5">
                        {availability.blockedReason || 'Clinic is unavailable on this date. Please select another day.'}
                      </div>
                    </div>
                  </div>
                )}

                {/* State: Closed weekday */}
                {!availability.isBlocked && availability.isClosedDay && (
                  <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Clinic Closed on this Day</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Our practice does not operate on this weekday according to business hours. Please choose another date.
                      </div>
                    </div>
                  </div>
                )}

                {/* State: No slots available (e.g. booked out or too close to current time) */}
                {!availability.isBlocked && !availability.isClosedDay && availability.slots.length === 0 && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-center space-y-2">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="font-bold text-sm">No Available Time Slots Remaining</div>
                    <div className="text-xs text-slate-500 max-w-md mx-auto">
                      All consultation windows for this date are fully reserved or within our minimum booking notice window ({settings.booking_notice_hours || 2} hours).
                      Please choose an alternate date.
                    </div>
                  </div>
                )}

                {/* State: Active slots grid */}
                {!availability.isBlocked && !availability.isClosedDay && availability.slots.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availability.slots.map((slot) => {
                      const isSelected = selectedSlot?.timeString === slot.timeString;

                      return (
                        <button
                          key={slot.timeString}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-500/20'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:bg-teal-50/30'
                          }`}
                        >
                          <span className="text-sm font-bold tabular-nums">
                            {slot.label.split('–')[0]?.trim()}
                          </span>
                          <span className={`text-[10px] ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                            until {slot.label.split('–')[1]?.trim()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Services</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setCurrentStep(3)}
                  className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all flex items-center gap-2 shadow-md ${
                    selectedSlot
                      ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25'
                      : 'bg-slate-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>Continue to Patient Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PATIENT DETAILS ================= */}
          {currentStep === 3 && selectedService && selectedSlot && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Step 3: Patient Information</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  We will send your appointment confirmation and clinical prep checklist to this contact.
                </p>
              </div>

              {/* Summary Pill Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Treatment</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedService.name}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Date & Time</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {selectedSlot.label}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Fee Estimate</div>
                  <div className="font-bold text-teal-700 text-sm mt-0.5 tabular-nums">
                    ${Number(selectedService.price).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Full Legal Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all bg-white"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all bg-white"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all bg-white"
                  />
                </div>

                {/* Clinical Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Specific Symptoms or Clinical Notes (Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Mild cold sensitivity on lower left molar, or previous dental anxiety."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all bg-white"
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Change Time Slot</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-all shadow-md shadow-teal-600/25 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Securing Appointment...</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-4 h-4" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 4: SUCCESS CONFIRMATION ================= */}
          {currentStep === 4 && confirmedAppointment && (
            <div className="py-4 space-y-8 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Appointment Confirmed!
                </h3>
                <p className="text-sm text-slate-600">
                  Thank you, <span className="font-semibold text-slate-900">{confirmedAppointment.full_name}</span>.
                  Your visit has been registered with our front desk.
                </p>
              </div>

              {/* Detailed Summary Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Booking Reference</span>
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2.5 py-1 rounded-md">
                    #{confirmedAppointment.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 text-xs">Service:</span>
                    <span className="font-bold text-slate-900 text-right">
                      {confirmedAppointment.service?.name || selectedService?.name}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 text-xs">Date:</span>
                    <span className="font-bold text-slate-900">
                      {new Date(confirmedAppointment.appointment_date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 text-xs">Time Window:</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {confirmedAppointment.start_time.slice(0, 5)} – {confirmedAppointment.end_time.slice(0, 5)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 text-xs">Patient Email:</span>
                    <span className="font-medium text-slate-700">{confirmedAppointment.email}</span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 text-xs">Patient Phone:</span>
                    <span className="font-medium text-slate-700">{confirmedAppointment.phone}</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-200">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      Clinic Location:
                    </span>
                    <span className="font-medium text-slate-700 text-xs text-right max-w-xs">
                      {settings.clinic_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions / Next Steps */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/60 text-xs text-teal-800 text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                  What to expect next:
                </div>
                <p className="text-teal-900/80 leading-relaxed">
                  A verification email has been sent. Please arrive 10 minutes before your scheduled start time.
                  If you need to reschedule, please call our front desk at{' '}
                  <span className="font-semibold">{settings.clinic_phone}</span>.
                </p>
              </div>

              {/* New Booking Button */}
              <div className="pt-2">
                <button
                  onClick={handleBookAnother}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-teal-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
                >
                  Schedule Another Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
