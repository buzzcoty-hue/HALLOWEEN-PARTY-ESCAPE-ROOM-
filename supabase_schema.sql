-- Aura Dental Studio: Supabase Database Schema & Initial Data
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create clinic_settings table
CREATE TABLE IF NOT EXISTS public.clinic_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_name TEXT NOT NULL DEFAULT 'Aura Dental Studio',
    clinic_email TEXT NOT NULL DEFAULT 'care@auradentalstudio.com',
    clinic_phone TEXT NOT NULL DEFAULT '+1 (555) 382-7200',
    clinic_address TEXT NOT NULL DEFAULT '450 Sutter St, Suite 1400, San Francisco, CA 94108',
    slot_interval_minutes INTEGER NOT NULL DEFAULT 30,
    booking_notice_hours INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create business_hours table (weekday: 0 = Sunday, 1 = Monday, ... 6 = Saturday)
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekday INTEGER NOT NULL UNIQUE,
    is_open BOOLEAN NOT NULL DEFAULT true,
    start_time TIME NOT NULL DEFAULT '08:30:00',
    end_time TIME NOT NULL DEFAULT '17:30:00'
);

-- 4. Create blocked_dates table
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create admin_users table (references auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Services Policies: public read active services, admin full access
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services" ON public.services
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Clinic Settings Policies: public can read, admin can update
DROP POLICY IF EXISTS "Public can view clinic settings" ON public.clinic_settings;
CREATE POLICY "Public can view clinic settings" ON public.clinic_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage clinic settings" ON public.clinic_settings;
CREATE POLICY "Admins can manage clinic settings" ON public.clinic_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Business Hours Policies: public read, admin manage
DROP POLICY IF EXISTS "Public can view business hours" ON public.business_hours;
CREATE POLICY "Public can view business hours" ON public.business_hours
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage business hours" ON public.business_hours;
CREATE POLICY "Admins can manage business hours" ON public.business_hours
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Blocked Dates Policies: public read, admin manage
DROP POLICY IF EXISTS "Public can view blocked dates" ON public.blocked_dates;
CREATE POLICY "Public can view blocked dates" ON public.blocked_dates
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage blocked dates" ON public.blocked_dates;
CREATE POLICY "Admins can manage blocked dates" ON public.blocked_dates
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Appointments Policies: public insert, admin full access
DROP POLICY IF EXISTS "Public can book appointment" ON public.appointments;
CREATE POLICY "Public can book appointment" ON public.appointments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can check booked slots" ON public.appointments;
CREATE POLICY "Public can check booked slots" ON public.appointments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
CREATE POLICY "Admins can manage all appointments" ON public.appointments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Admin Users Policies: authenticated users can check if their own user_id is in admin_users
DROP POLICY IF EXISTS "Users can check own admin status" ON public.admin_users;
CREATE POLICY "Users can check own admin status" ON public.admin_users
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and manage admin users" ON public.admin_users;
CREATE POLICY "Admins can view and manage admin users" ON public.admin_users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
    );

-- Seed Initial Default Clinic Settings if empty
INSERT INTO public.clinic_settings (clinic_name, clinic_email, clinic_phone, clinic_address, slot_interval_minutes, booking_notice_hours)
SELECT 'Aura Dental Studio', 'care@auradentalstudio.com', '+1 (555) 382-7200', '450 Sutter St, Suite 1400, San Francisco, CA 94108', 30, 2
WHERE NOT EXISTS (SELECT 1 FROM public.clinic_settings);

-- Seed Business Hours (0 = Sunday closed, 1-5 = Mon-Fri open 8:30 to 17:30, 6 = Sat open 9:00 to 14:00)
INSERT INTO public.business_hours (weekday, is_open, start_time, end_time)
VALUES
    (0, false, '09:00:00', '13:00:00'),
    (1, true,  '08:30:00', '17:30:00'),
    (2, true,  '08:30:00', '17:30:00'),
    (3, true,  '08:30:00', '17:30:00'),
    (4, true,  '08:30:00', '17:30:00'),
    (5, true,  '08:30:00', '17:00:00'),
    (6, true,  '09:00:00', '14:00:00')
ON CONFLICT (weekday) DO NOTHING;

-- Seed Initial Dental Services
INSERT INTO public.services (name, description, duration_minutes, price, is_active)
SELECT 'Comprehensive Dental Examination & 3D Imaging', 'Complete visual inspection, low-radiation digital 3D radiographs, periodontal health charting, and personalized preventative care roadmap.', 45, 120.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Comprehensive Dental Examination & 3D Imaging');

INSERT INTO public.services (name, description, duration_minutes, price, is_active)
SELECT 'Ultrasonic Hygiene & Guided Air-Polishing', 'Gentle subgingival calculus removal using piezoceramic ultrasonic precision scaling, followed by botanical air-flow stain removal.', 60, 160.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Ultrasonic Hygiene & Guided Air-Polishing');

INSERT INTO public.services (name, description, duration_minutes, price, is_active)
SELECT 'In-Office Enamel-Safe Teeth Whitening', 'Medical-grade cold blue-light accelerated whitening treatment delivering 6–8 shades of brightening with zero enamel sensitivity.', 60, 320.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'In-Office Enamel-Safe Teeth Whitening');

INSERT INTO public.services (name, description, duration_minutes, price, is_active)
SELECT 'Biomimetic Composite Restoration', 'Natural tooth-colored composite resin bonding for decayed, chipped, or fractured teeth restoring original biomechanics and aesthetics.', 45, 210.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Biomimetic Composite Restoration');

INSERT INTO public.services (name, description, duration_minutes, price, is_active)
SELECT 'Emergency Pain Relief & Focused Consultation', 'Prompt triage, localized radiographic assessment, palliative care, and urgent treatment plan for toothaches or trauma.', 30, 95.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Emergency Pain Relief & Focused Consultation');

INSERT INTO public.services (name, description, duration_minutes, price, is_active)
SELECT 'Clear Aligner Orthodontic Evaluation', 'Iterative intraoral 3D scan and virtual simulation showing projected tooth alignment and smile aesthetic transformation.', 40, 75.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE name = 'Clear Aligner Orthodontic Evaluation');
