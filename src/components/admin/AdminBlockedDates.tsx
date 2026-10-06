import React, { useState } from 'react';
import { BlockedDate } from '../../types';
import { CalendarOff, Plus, Trash2, AlertCircle, Check } from 'lucide-react';

interface AdminBlockedDatesProps {
  blockedDates: BlockedDate[];
  onAddBlockedDate: (date: string, reason?: string) => Promise<void>;
  onDeleteBlockedDate: (id: string) => Promise<void>;
}

export const AdminBlockedDates: React.FC<AdminBlockedDatesProps> = ({
  blockedDates,
  onAddBlockedDate,
  onDeleteBlockedDate,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newDate) {
      setErrorMsg('Please select a date to block.');
      return;
    }

    // Check if date already blocked
    if (blockedDates.some((b) => b.blocked_date === newDate)) {
      setErrorMsg('This date is already listed as blocked.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddBlockedDate(newDate, newReason.trim() || 'Practice Closed / Holiday');
      setNewDate('');
      setNewReason('');
      setSuccessMsg('Date blocked successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error adding blocked date:', err);
      setErrorMsg('Failed to add blocked date.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteBlockedDate(id);
    } catch (err) {
      console.error('Error deleting blocked date:', err);
    }
  };

  // Sort blocked dates chronologically
  const sortedBlockedDates = [...blockedDates].sort((a, b) =>
    a.blocked_date.localeCompare(b.blocked_date)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Blocked Practice Dates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Prevent patient bookings on specific calendar dates (holidays, staff training, renovation).
          </p>
        </div>

        {successMsg && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Add Blocked Date Form (4 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CalendarOff className="w-4 h-4 text-teal-600" />
            <span>Block a Calendar Date</span>
          </h3>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Date to Block *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Reason / Clinical Note
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. Annual Dental Hygiene Symposium"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              <span className="text-[11px] text-slate-400">
                This notice will be shown to patients if they select this date.
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 transition-all shadow-sm shadow-teal-600/25 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Blocking Date...' : 'Add Blocked Date'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Blocked Dates List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Active Blocked Dates ({sortedBlockedDates.length})
            </h3>
            <span className="text-xs text-slate-400">Slots on these days will be unavailable</span>
          </div>

          {sortedBlockedDates.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CalendarOff className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-sm font-medium">No dates currently blocked.</div>
              <div className="text-xs text-slate-400">
                All business days according to weekly operating hours are open for patient bookings.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sortedBlockedDates.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 -mx-3 px-3 rounded-xl transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{item.blocked_date}</span>
                      <span className="text-xs font-normal text-slate-500">
                        (
                        {new Date(item.blocked_date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        )
                      </span>
                    </div>
                    <div className="text-xs text-amber-700">
                      Reason: {item.reason || 'Practice Closed'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove date block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
