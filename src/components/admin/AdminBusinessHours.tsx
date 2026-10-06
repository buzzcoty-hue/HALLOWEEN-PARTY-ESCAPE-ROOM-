import React, { useState } from 'react';
import { BusinessHours } from '../../types';
import { Clock, Check, AlertCircle } from 'lucide-react';

interface AdminBusinessHoursProps {
  businessHours: BusinessHours[];
  onUpdateBusinessHour: (id: string, updates: Partial<BusinessHours>) => Promise<void>;
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const AdminBusinessHours: React.FC<AdminBusinessHoursProps> = ({
  businessHours,
  onUpdateBusinessHour,
}) => {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Local state to make inputs smooth
  const [localHours, setLocalHours] = useState<BusinessHours[]>(businessHours);

  // Sync if businessHours props change
  React.useEffect(() => {
    setLocalHours(businessHours);
  }, [businessHours]);

  const handleFieldChange = (
    id: string,
    field: keyof BusinessHours,
    val: boolean | string | number
  ) => {
    setLocalHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );
  };

  const handleSaveRow = async (item: BusinessHours) => {
    setSavingId(item.id);
    setSuccessMsg(null);
    try {
      await onUpdateBusinessHour(item.id, {
        is_open: item.is_open,
        start_time: item.start_time,
        end_time: item.end_time,
      });
      setSuccessMsg(`Hours updated for ${WEEKDAY_NAMES[item.weekday]}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to update business hour:', err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Practice Business Hours
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Set weekly clinic operating times. Slot generation dynamically respects opening and closing hours.
          </p>
        </div>

        {successMsg && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Notice Card */}
      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Direct Availability Impact:</strong> Turning a weekday off or adjusting start/end times
          immediately alters the slots presented to patients during online booking.
        </div>
      </div>

      {/* Hours Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {localHours.map((hour) => {
            const isSaving = savingId === hour.id;

            return (
              <div
                key={hour.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  hour.is_open ? 'hover:bg-slate-50/50' : 'bg-slate-50/30'
                }`}
              >
                {/* Weekday & Status */}
                <div className="flex items-center gap-4 min-w-[160px]">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      hour.is_open ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {WEEKDAY_NAMES[hour.weekday]}
                    </div>
                    <div className="text-xs text-slate-500">
                      {hour.is_open ? 'Open for appointments' : 'Practice Closed'}
                    </div>
                  </div>
                </div>

                {/* Open/Closed Toggle & Time Controls */}
                <div className="flex flex-wrap items-center gap-4 flex-1 justify-start sm:justify-center">
                  {/* Open checkbox */}
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hour.is_open}
                      onChange={(e) =>
                        handleFieldChange(hour.id, 'is_open', e.target.checked)
                      }
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span>Operating Day</span>
                  </label>

                  {/* Start & End Times (only active if is_open) */}
                  {hour.is_open ? (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="time"
                        value={hour.start_time.slice(0, 5)}
                        onChange={(e) =>
                          handleFieldChange(hour.id, 'start_time', `${e.target.value}:00`)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hour.end_time.slice(0, 5)}
                        onChange={(e) =>
                          handleFieldChange(hour.id, 'end_time', `${e.target.value}:00`)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      No patient appointments accepted on this day.
                    </span>
                  )}
                </div>

                {/* Save button for this row */}
                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleSaveRow(hour)}
                    disabled={isSaving}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-teal-700 hover:text-white hover:bg-teal-600 border border-teal-200 hover:border-transparent transition-all shadow-sm"
                  >
                    {isSaving ? 'Saving...' : 'Apply Changes'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
