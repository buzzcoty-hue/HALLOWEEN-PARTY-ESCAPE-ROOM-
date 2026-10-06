import React from 'react';
import { Appointment, Service, BusinessHours, AppointmentStatus } from '../../types';
import {
  Calendar,
  Users,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface AdminOverviewProps {
  appointments: Appointment[];
  services: Service[];
  businessHours: BusinessHours[];
  onNavigateToTab: (tab: string) => void;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  appointments,
  services,
  businessHours,
  onNavigateToTab,
  onUpdateAppointmentStatus,
}) => {
  // Compute Key Metrics
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');
  const activeServices = services.filter((s) => s.is_active);

  // Estimated booking value
  const estimatedRevenue = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => {
      const srv = services.find((s) => s.id === a.service_id);
      return sum + (srv ? Number(srv.price) : 120);
    }, 0);

  // Today's business hours
  const todayWeekday = new Date().getDay();
  const todayHours = businessHours.find((h) => Number(h.weekday) === todayWeekday);

  // Upcoming appointments (sorted soonest first)
  const upcomingQueue = [...appointments]
    .filter((a) => a.status === 'pending' || a.status === 'confirmed')
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Practice Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time appointment schedule, patient volume, and practice metrics.
          </p>
        </div>

        {/* Today's clinic status pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200/90 shadow-sm text-xs">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              todayHours?.is_open ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
            }`}
          />
          <span className="font-semibold text-slate-700">
            {todayHours?.is_open
              ? `Open Today: ${todayHours.start_time.slice(0, 5)} – ${todayHours.end_time.slice(0, 5)}`
              : 'Clinic Closed Today'}
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Requests
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {pendingAppointments.length}
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span>Awaiting confirmation</span>
            {pendingAppointments.length > 0 && (
              <button
                onClick={() => onNavigateToTab('appointments')}
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Review →
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Upcoming Confirmed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Confirmed Visits
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {confirmedAppointments.length}
          </div>
          <div className="text-xs text-slate-500 pt-1">
            <span>Scheduled on practice calendar</span>
          </div>
        </div>

        {/* Card 3: Active Dental Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Services
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {activeServices.length}
            <span className="text-xs text-slate-400 font-normal ml-1.5">
              / {services.length} total
            </span>
          </div>
          <div className="text-xs text-slate-500 pt-1 flex justify-between items-center">
            <span>Bookable online</span>
            <button
              onClick={() => onNavigateToTab('services')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Manage →
            </button>
          </div>
        </div>

        {/* Card 4: Estimated Booking Pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Scheduled Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            ${estimatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500 pt-1">
            <span>Across {totalAppointments - appointments.filter((a) => a.status === 'cancelled').length} scheduled visits</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Upcoming Patient Queue (7 cols) + Quick Practice Status (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Patient Appointment Queue */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Actionable Patient Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Appointments requiring clinical confirmation or upcoming for treatment.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('appointments')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All ({appointments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingQueue.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-sm font-medium">No pending or upcoming appointments.</div>
              <div className="text-xs text-slate-400">All registered visits have been completed.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcomingQueue.map((apt) => {
                const srv = services.find((s) => s.id === apt.service_id);

                return (
                  <div key={apt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 -mx-3 px-3 rounded-xl transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{apt.full_name}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            apt.status === 'confirmed'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="text-teal-800 font-medium">
                          {srv?.name || 'Dental Consultation'}
                        </span>
                        <span>·</span>
                        <span className="tabular-nums">
                          {apt.appointment_date} at {apt.start_time.slice(0, 5)}
                        </span>
                      </div>
                      {apt.notes && (
                        <div className="text-[11px] text-slate-400 italic line-clamp-1">
                          "{apt.notes}"
                        </div>
                      )}
                    </div>

                    {/* Quick status actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {apt.status === 'pending' && (
                        <button
                          onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                          className="px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-lg border border-teal-200 flex items-center gap-1"
                          title="Confirm Appointment"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                          <span>Confirm</span>
                        </button>
                      )}

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                          className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1"
                          title="Mark Visit Completed"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Complete</span>
                        </button>
                      )}

                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Practice Quick Status & Navigation shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Schedule Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Practice Schedule Today</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Working Status:</span>
                <span className={todayHours?.is_open ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                  {todayHours?.is_open ? 'Open For Patient Visits' : 'Closed'}
                </span>
              </div>
              {todayHours?.is_open && (
                <div className="flex justify-between text-slate-600 tabular-nums">
                  <span>Operating Window:</span>
                  <span>
                    {todayHours.start_time.slice(0, 5)} to {todayHours.end_time.slice(0, 5)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onNavigateToTab('business-hours')}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Edit Weekly Operating Hours</span>
                <span>→</span>
              </button>
              <button
                onClick={() => onNavigateToTab('blocked-dates')}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Manage Practice Blocked Dates</span>
                <span>→</span>
              </button>
              <button
                onClick={() => onNavigateToTab('settings')}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Clinic Profile & Notice Windows</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-5 text-xs text-teal-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-teal-800">
              <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Real-Time Slot Engine Active</span>
            </div>
            <p className="text-teal-900/80 leading-relaxed">
              When appointments are confirmed or cancelled, open time slots recalculate automatically on the public site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
