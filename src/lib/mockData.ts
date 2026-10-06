import { ClinicSettings, BusinessHours, Service, Appointment, BlockedDate } from '../types';

export const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
  id: 'clinic-default-1',
  clinic_name: 'Aura Dental Studio',
  clinic_email: 'care@auradentalstudio.com',
  clinic_phone: '+1 (555) 382-7200',
  clinic_address: '450 Sutter St, Suite 1400, San Francisco, CA 94108',
  slot_interval_minutes: 30,
  booking_notice_hours: 2,
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  { id: 'bh-0', weekday: 0, is_open: false, start_time: '09:00:00', end_time: '13:00:00' },
  { id: 'bh-1', weekday: 1, is_open: true,  start_time: '08:30:00', end_time: '17:30:00' },
  { id: 'bh-2', weekday: 2, is_open: true,  start_time: '08:30:00', end_time: '17:30:00' },
  { id: 'bh-3', weekday: 3, is_open: true,  start_time: '08:30:00', end_time: '17:30:00' },
  { id: 'bh-4', weekday: 4, is_open: true,  start_time: '08:30:00', end_time: '17:30:00' },
  { id: 'bh-5', weekday: 5, is_open: true,  start_time: '08:30:00', end_time: '17:00:00' },
  { id: 'bh-6', weekday: 6, is_open: true,  start_time: '09:00:00', end_time: '14:00:00' },
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Comprehensive Dental Examination & 3D Imaging',
    description: 'Complete visual inspection, low-radiation digital 3D radiographs, periodontal health charting, and personalized preventative care roadmap.',
    duration_minutes: 45,
    price: 120.00,
    is_active: true,
  },
  {
    id: 'srv-2',
    name: 'Ultrasonic Hygiene & Guided Air-Polishing',
    description: 'Gentle subgingival calculus removal using piezoceramic ultrasonic precision scaling, followed by botanical air-flow stain removal.',
    duration_minutes: 60,
    price: 160.00,
    is_active: true,
  },
  {
    id: 'srv-3',
    name: 'In-Office Enamel-Safe Teeth Whitening',
    description: 'Medical-grade cold blue-light accelerated whitening treatment delivering 6–8 shades of brightening with zero enamel sensitivity.',
    duration_minutes: 60,
    price: 320.00,
    is_active: true,
  },
  {
    id: 'srv-4',
    name: 'Biomimetic Composite Restoration',
    description: 'Natural tooth-colored composite resin bonding for decayed, chipped, or fractured teeth restoring original biomechanics and aesthetics.',
    duration_minutes: 45,
    price: 210.00,
    is_active: true,
  },
  {
    id: 'srv-5',
    name: 'Emergency Pain Relief & Focused Consultation',
    description: 'Prompt triage, localized radiographic assessment, palliative care, and urgent treatment plan for toothaches or trauma.',
    duration_minutes: 30,
    price: 95.00,
    is_active: true,
  },
  {
    id: 'srv-6',
    name: 'Clear Aligner Orthodontic Evaluation',
    description: 'Iterative intraoral 3D scan and virtual simulation showing projected tooth alignment and smile aesthetic transformation.',
    duration_minutes: 40,
    price: 75.00,
    is_active: true,
  },
];

// Helper to get formatted dates relative to today
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_BLOCKED_DATES: BlockedDate[] = [
  {
    id: 'bd-1',
    blocked_date: getRelativeDate(14),
    reason: 'Dental Hygiene Annual Seminar & Practice Development',
  },
];

export const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    full_name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 492-8812',
    service_id: 'srv-1',
    appointment_date: getRelativeDate(1),
    start_time: '09:00:00',
    end_time: '09:45:00',
    status: 'confirmed',
    notes: 'First time visit. Experiences slight sensitivity on lower left molar.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'apt-2',
    full_name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    phone: '+1 (555) 831-4029',
    service_id: 'srv-2',
    appointment_date: getRelativeDate(1),
    start_time: '11:00:00',
    end_time: '12:00:00',
    status: 'confirmed',
    notes: 'Routine 6-month cleaning before upcoming wedding.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'apt-3',
    full_name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 209-7741',
    service_id: 'srv-3',
    appointment_date: getRelativeDate(2),
    start_time: '14:00:00',
    end_time: '15:00:00',
    status: 'pending',
    notes: 'Interested in shade evaluation prior to treatment.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'apt-4',
    full_name: 'David Alvarez',
    email: 'd.alvarez@example.com',
    phone: '+1 (555) 674-1234',
    service_id: 'srv-4',
    appointment_date: getRelativeDate(-2),
    start_time: '10:30:00',
    end_time: '11:15:00',
    status: 'completed',
    notes: 'Bonding on upper lateral incisor completed smoothly.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];
