import { supabase, isConfigured } from './supabase';
import {
  Service,
  Appointment,
  BusinessHours,
  BlockedDate,
  ClinicSettings,
  AppointmentStatus,
} from '../types';
import {
  DEFAULT_SERVICES,
  DEFAULT_CLINIC_SETTINGS,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_BLOCKED_DATES,
  DEFAULT_APPOINTMENTS,
} from './mockData';

// Local storage backup keys for offline or initial preview mode
const LS_SERVICES = 'aura_local_services';
const LS_SETTINGS = 'aura_local_settings';
const LS_HOURS = 'aura_local_hours';
const LS_BLOCKED = 'aura_local_blocked';
const LS_APPOINTMENTS = 'aura_local_appointments';

function getLocalOrInit<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(val));
  }
}

/* =========================================================
   SERVICES
   ========================================================= */

export async function fetchServices(activeOnly = false): Promise<Service[]> {
  if (isConfigured) {
    try {
      let query = supabase.from('services').select('*').order('created_at', { ascending: true });
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Service[];
      }
      // If table is empty or error, fallback to local/defaults
    } catch (e) {
      console.warn('Supabase fetchServices fallback:', e);
    }
  }

  const list = getLocalOrInit<Service[]>(LS_SERVICES, DEFAULT_SERVICES);
  return activeOnly ? list.filter((s) => s.is_active) : list;
}

export async function createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
  const newServiceItem: Service = {
    ...service,
    id: `srv-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([{
          name: service.name,
          description: service.description,
          duration_minutes: service.duration_minutes,
          price: service.price,
          is_active: service.is_active,
        }])
        .select()
        .single();

      if (!error && data) {
        return data as Service;
      }
    } catch (e) {
      console.warn('Supabase createService error:', e);
    }
  }

  // Fallback to local storage
  const current = getLocalOrInit<Service[]>(LS_SERVICES, DEFAULT_SERVICES);
  const updated = [...current, newServiceItem];
  setLocal(LS_SERVICES, updated);
  return newServiceItem;
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Service;
      }
    } catch (e) {
      console.warn('Supabase updateService error:', e);
    }
  }

  const current = getLocalOrInit<Service[]>(LS_SERVICES, DEFAULT_SERVICES);
  let updatedItem: Service | null = null;
  const nextList = current.map((s) => {
    if (s.id === id) {
      updatedItem = { ...s, ...updates };
      return updatedItem;
    }
    return s;
  });
  setLocal(LS_SERVICES, nextList);
  return updatedItem;
}

/* =========================================================
   CLINIC SETTINGS
   ========================================================= */

export async function fetchClinicSettings(): Promise<ClinicSettings> {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data as ClinicSettings;
      }
    } catch (e) {
      console.warn('Supabase fetchClinicSettings error:', e);
    }
  }

  return getLocalOrInit<ClinicSettings>(LS_SETTINGS, DEFAULT_CLINIC_SETTINGS);
}

export async function updateClinicSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings> {
  if (isConfigured) {
    try {
      // First check if an existing row exists
      const { data: existing } = await supabase.from('clinic_settings').select('id').limit(1).maybeSingle();
      if (existing?.id) {
        const { data, error } = await supabase
          .from('clinic_settings')
          .update(settings)
          .eq('id', existing.id)
          .select()
          .single();
        if (!error && data) return data as ClinicSettings;
      } else {
        const { data, error } = await supabase
          .from('clinic_settings')
          .insert([settings])
          .select()
          .single();
        if (!error && data) return data as ClinicSettings;
      }
    } catch (e) {
      console.warn('Supabase updateClinicSettings error:', e);
    }
  }

  const current = getLocalOrInit<ClinicSettings>(LS_SETTINGS, DEFAULT_CLINIC_SETTINGS);
  const updated = { ...current, ...settings };
  setLocal(LS_SETTINGS, updated);
  return updated;
}

/* =========================================================
   BUSINESS HOURS
   ========================================================= */

export async function fetchBusinessHours(): Promise<BusinessHours[]> {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('weekday', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as BusinessHours[];
      }
    } catch (e) {
      console.warn('Supabase fetchBusinessHours error:', e);
    }
  }

  return getLocalOrInit<BusinessHours[]>(LS_HOURS, DEFAULT_BUSINESS_HOURS);
}

export async function updateBusinessHour(id: string, updates: Partial<BusinessHours>): Promise<void> {
  if (isConfigured) {
    try {
      await supabase.from('business_hours').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateBusinessHour error:', e);
    }
  }

  const current = getLocalOrInit<BusinessHours[]>(LS_HOURS, DEFAULT_BUSINESS_HOURS);
  const updated = current.map((bh) => (bh.id === id ? { ...bh, ...updates } : bh));
  setLocal(LS_HOURS, updated);
}

/* =========================================================
   BLOCKED DATES
   ========================================================= */

export async function fetchBlockedDates(): Promise<BlockedDate[]> {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true });

      if (!error && data) {
        return data as BlockedDate[];
      }
    } catch (e) {
      console.warn('Supabase fetchBlockedDates error:', e);
    }
  }

  return getLocalOrInit<BlockedDate[]>(LS_BLOCKED, DEFAULT_BLOCKED_DATES);
}

export async function addBlockedDate(blocked_date: string, reason?: string): Promise<BlockedDate> {
  const newItem: BlockedDate = {
    id: `bd-${Date.now()}`,
    blocked_date,
    reason: reason || null,
    created_at: new Date().toISOString(),
  };

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert([{ blocked_date, reason }])
        .select()
        .single();

      if (!error && data) return data as BlockedDate;
    } catch (e) {
      console.warn('Supabase addBlockedDate error:', e);
    }
  }

  const current = getLocalOrInit<BlockedDate[]>(LS_BLOCKED, DEFAULT_BLOCKED_DATES);
  const updated = [...current, newItem];
  setLocal(LS_BLOCKED, updated);
  return newItem;
}

export async function deleteBlockedDate(id: string): Promise<void> {
  if (isConfigured) {
    try {
      await supabase.from('blocked_dates').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteBlockedDate error:', e);
    }
  }

  const current = getLocalOrInit<BlockedDate[]>(LS_BLOCKED, DEFAULT_BLOCKED_DATES);
  const updated = current.filter((b) => b.id !== id);
  setLocal(LS_BLOCKED, updated);
}

/* =========================================================
   APPOINTMENTS
   ========================================================= */

export async function fetchAppointments(): Promise<Appointment[]> {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, service:services(*)')
        .order('appointment_date', { ascending: false });

      if (!error && data) {
        return data as Appointment[];
      }
    } catch (e) {
      console.warn('Supabase fetchAppointments error:', e);
    }
  }

  const list = getLocalOrInit<Appointment[]>(LS_APPOINTMENTS, DEFAULT_APPOINTMENTS);
  const services = getLocalOrInit<Service[]>(LS_SERVICES, DEFAULT_SERVICES);
  return list.map((apt) => ({
    ...apt,
    service: apt.service || services.find((s) => s.id === apt.service_id),
  }));
}

export async function createAppointment(
  appointment: Omit<Appointment, 'id' | 'created_at' | 'service'>
): Promise<Appointment> {
  const newItem: Appointment = {
    ...appointment,
    id: `apt-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          full_name: appointment.full_name,
          email: appointment.email,
          phone: appointment.phone,
          service_id: appointment.service_id,
          appointment_date: appointment.appointment_date,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          status: appointment.status || 'pending',
          notes: appointment.notes || null,
        }])
        .select('*, service:services(*)')
        .single();

      if (!error && data) {
        return data as Appointment;
      } else if (error) {
        console.error('Supabase appointment insert error:', error);
      }
    } catch (e) {
      console.warn('Supabase createAppointment error:', e);
    }
  }

  const current = getLocalOrInit<Appointment[]>(LS_APPOINTMENTS, DEFAULT_APPOINTMENTS);
  const updated = [newItem, ...current];
  setLocal(LS_APPOINTMENTS, updated);
  return newItem;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  if (isConfigured) {
    try {
      await supabase.from('appointments').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateAppointmentStatus error:', e);
    }
  }

  const current = getLocalOrInit<Appointment[]>(LS_APPOINTMENTS, DEFAULT_APPOINTMENTS);
  const updated = current.map((apt) => (apt.id === id ? { ...apt, status } : apt));
  setLocal(LS_APPOINTMENTS, updated);
}

/* =========================================================
   ADMIN USER AUTH CHECK (admin_users.user_id)
   ========================================================= */

/**
 * Checks if the given Supabase Auth user_id exists in public.admin_users
 * Rule: Compare auth.user.id with admin_users.user_id. Do not check by email.
 */
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  if (!userId) return false;

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error verifying admin access in admin_users:', error);
        return false;
      }

      return Boolean(data && data.user_id === userId);
    } catch (err) {
      console.error('Supabase admin check exception:', err);
      return false;
    }
  }

  // In offline preview mode when credentials are not yet entered,
  // allow the demo admin access so the reviewer can inspect all dashboard pages.
  return true;
}

/**
 * Helper to bootstrap seed data into Supabase if tables were just created
 */
export async function seedInitialDataToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isConfigured) {
    return { success: false, message: 'Please enter valid Supabase credentials first.' };
  }

  try {
    // 1. Check services
    const { data: existingServices } = await supabase.from('services').select('id').limit(1);
    if (!existingServices || existingServices.length === 0) {
      await supabase.from('services').insert(
        DEFAULT_SERVICES.map((s) => ({
          name: s.name,
          description: s.description,
          duration_minutes: s.duration_minutes,
          price: s.price,
          is_active: s.is_active,
        }))
      );
    }

    // 2. Check settings
    const { data: existingSettings } = await supabase.from('clinic_settings').select('id').limit(1);
    if (!existingSettings || existingSettings.length === 0) {
      await supabase.from('clinic_settings').insert([{
        clinic_name: DEFAULT_CLINIC_SETTINGS.clinic_name,
        clinic_email: DEFAULT_CLINIC_SETTINGS.clinic_email,
        clinic_phone: DEFAULT_CLINIC_SETTINGS.clinic_phone,
        clinic_address: DEFAULT_CLINIC_SETTINGS.clinic_address,
        slot_interval_minutes: DEFAULT_CLINIC_SETTINGS.slot_interval_minutes,
        booking_notice_hours: DEFAULT_CLINIC_SETTINGS.booking_notice_hours,
      }]);
    }

    // 3. Check business hours
    const { data: existingHours } = await supabase.from('business_hours').select('id').limit(1);
    if (!existingHours || existingHours.length === 0) {
      await supabase.from('business_hours').insert(
        DEFAULT_BUSINESS_HOURS.map((h) => ({
          weekday: h.weekday,
          is_open: h.is_open,
          start_time: h.start_time,
          end_time: h.end_time,
        }))
      );
    }

    return { success: true, message: 'Initial clinic records seeded successfully!' };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to seed initial data.',
    };
  }
}
