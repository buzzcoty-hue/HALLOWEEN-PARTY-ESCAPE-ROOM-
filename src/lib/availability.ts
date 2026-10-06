import { Appointment, BlockedDate, BusinessHours, ClinicSettings, Service, TimeSlot } from '../types';

/**
 * Format a Date to 'YYYY-MM-DD'
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format Date to 12-hour time string "9:00 AM"
 */
export function formatTime12h(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minStr = String(minutes).padStart(2, '0');
  return `${hours}:${minStr} ${ampm}`;
}

/**
 * Format Date to 24-hour time string "09:00:00"
 */
export function formatTime24h(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Parses a time string (e.g. "08:30:00" or "08:30") on a given base date
 */
export function parseTimeToDate(baseDate: Date, timeStr: string): Date {
  const [hStr, mStr, sStr] = timeStr.split(':');
  const d = new Date(baseDate);
  d.setHours(parseInt(hStr, 10) || 0, parseInt(mStr, 10) || 0, parseInt(sStr, 10) || 0, 0);
  return d;
}

export interface AvailabilityResult {
  slots: TimeSlot[];
  isBlocked: boolean;
  blockedReason?: string;
  isClosedDay: boolean;
}

/**
 * Compute available slots for a given target date and service
 */
export function generateAvailableSlots({
  targetDate,
  service,
  businessHours,
  blockedDates,
  existingAppointments,
  settings,
  now = new Date(),
}: {
  targetDate: Date;
  service: Service;
  businessHours: BusinessHours[];
  blockedDates: BlockedDate[];
  existingAppointments: Appointment[];
  settings: ClinicSettings;
  now?: Date;
}): AvailabilityResult {
  const dateKey = formatDateKey(targetDate);

  // 1. Check if date is blocked
  const blockedEntry = blockedDates.find((b) => b.blocked_date === dateKey);
  if (blockedEntry) {
    return {
      slots: [],
      isBlocked: true,
      blockedReason: blockedEntry.reason || 'Practice closed on this date',
      isClosedDay: false,
    };
  }

  // 2. Check business hours for weekday
  const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 1 is Monday ...
  const dayHours = businessHours.find((h) => Number(h.weekday) === dayOfWeek);

  if (!dayHours || !dayHours.is_open) {
    return {
      slots: [],
      isBlocked: false,
      isClosedDay: true,
    };
  }

  // 3. Compute opening and closing window
  const openTime = parseTimeToDate(targetDate, dayHours.start_time);
  const closeTime = parseTimeToDate(targetDate, dayHours.end_time);

  const durationMs = (service.duration_minutes || 45) * 60 * 1000;
  const intervalMs = Math.max(15, settings.slot_interval_minutes || 30) * 60 * 1000;
  const bookingNoticeMs = (settings.booking_notice_hours || 2) * 60 * 60 * 1000;
  const minimumBookingTime = new Date(now.getTime() + bookingNoticeMs);

  // Filter active (non-cancelled) existing appointments on this date
  const appointmentsOnDay = existingAppointments.filter((apt) => {
    if (apt.status === 'cancelled') return false;
    return apt.appointment_date === dateKey;
  });

  const slots: TimeSlot[] = [];

  // 4. Iterate over intervals
  let currentStart = new Date(openTime.getTime());

  while (currentStart.getTime() + durationMs <= closeTime.getTime()) {
    const currentEnd = new Date(currentStart.getTime() + durationMs);

    // Rule: Respect booking notice time
    const isPastNotice = currentStart.getTime() >= minimumBookingTime.getTime();

    if (isPastNotice) {
      // Rule: Check overlap with existing appointments
      // Overlap formula: new_start < existing_end AND new_end > existing_start
      const hasOverlap = appointmentsOnDay.some((apt) => {
        const aptStart = parseTimeToDate(targetDate, apt.start_time);
        const aptEnd = parseTimeToDate(targetDate, apt.end_time);
        return currentStart.getTime() < aptEnd.getTime() && currentEnd.getTime() > aptStart.getTime();
      });

      if (!hasOverlap) {
        slots.push({
          start: new Date(currentStart),
          end: new Date(currentEnd),
          label: `${formatTime12h(currentStart)} – ${formatTime12h(currentEnd)}`,
          timeString: formatTime24h(currentStart),
          endTimeString: formatTime24h(currentEnd),
        });
      }
    }

    // Advance by interval
    currentStart = new Date(currentStart.getTime() + intervalMs);
  }

  return {
    slots,
    isBlocked: false,
    isClosedDay: false,
  };
}
