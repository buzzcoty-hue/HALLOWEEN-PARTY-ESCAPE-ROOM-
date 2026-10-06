import React, { useState, useMemo } from 'react';
import { Appointment, Service, AppointmentStatus } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Mail,
  Phone,
  User,
  Calendar,
  Eye,
  X,
} from 'lucide-react';

interface AdminAppointmentsProps {
  appointments: Appointment[];
  services: Service[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({
  appointments,
  services,
  onUpdateStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Status filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) {
        return false;
      }
      // Search query filter (matches patient name, email, phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = apt.full_name.toLowerCase().includes(q);
        const matchesEmail = apt.email.toLowerCase().includes(q);
        const matchesPhone = apt.phone.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesPhone;
      }
      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  // Helper for status badge style
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Patient Appointments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage dental bookings, update visit status, and inspect patient medical notes.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredAppointments.length}</span> of{' '}
          {appointments.length} appointments
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, email, or telephone number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Status segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Filter className="w-8 h-8 mx-auto text-slate-300" />
            <div className="text-sm font-medium text-slate-600">No matching appointments found.</div>
            <div className="text-xs text-slate-400">
              Try adjusting your search criteria or status filter.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Treatment Service</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredAppointments.map((apt) => {
                  const srv = services.find((s) => s.id === apt.service_id);

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Patient Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {apt.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{apt.full_name}</div>
                            {apt.notes && (
                              <div className="text-[11px] text-slate-400 font-normal italic flex items-center gap-1 mt-0.5 max-w-xs truncate">
                                <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{apt.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium text-slate-900">
                          {srv?.name || 'General Dental Consultation'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {srv ? `${srv.duration_minutes}m · $${Number(srv.price).toFixed(2)}` : ''}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          {apt.appointment_date}
                        </div>
                        <div className="text-xs text-teal-700 font-medium tabular-nums">
                          {apt.start_time.slice(0, 5)} – {apt.end_time.slice(0, 5)}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                        <div>{apt.phone}</div>
                        <div className="text-slate-400">{apt.email}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(apt.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Inspect Details */}
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Full Appointment Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Status Select */}
                          <select
                            value={apt.status}
                            onChange={(e) =>
                              onUpdateStatus(apt.id, e.target.value as AppointmentStatus)
                            }
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Appointment Card
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedAppointment.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span>{getStatusBadge(selectedAppointment.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">
                    {services.find((s) => s.id === selectedAppointment.service_id)?.name ||
                      'Dental Consultation'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedAppointment.appointment_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-semibold text-teal-700 tabular-nums">
                    {selectedAppointment.start_time.slice(0, 5)} – {selectedAppointment.end_time.slice(0, 5)}
                  </span>
                </div>
              </div>

              {/* Patient Contact Info */}
              <div className="space-y-2 pt-1">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedAppointment.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <a href={`mailto:${selectedAppointment.email}`} className="text-teal-700 underline">
                      {selectedAppointment.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <a href={`tel:${selectedAppointment.phone}`} className="text-teal-700">
                      {selectedAppointment.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Patient Notes */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>Patient Symptoms & Notes</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed min-h-[60px]">
                  {selectedAppointment.notes || 'No special clinical notes provided during booking.'}
                </div>
              </div>
            </div>

            {/* Quick status change buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-medium">Update Status:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdateStatus(selectedAppointment.id, 'confirmed');
                    setSelectedAppointment({ ...selectedAppointment, status: 'confirmed' });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(selectedAppointment.id, 'completed');
                    setSelectedAppointment({ ...selectedAppointment, status: 'completed' });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                >
                  Complete
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(selectedAppointment.id, 'cancelled');
                    setSelectedAppointment({ ...selectedAppointment, status: 'cancelled' });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
