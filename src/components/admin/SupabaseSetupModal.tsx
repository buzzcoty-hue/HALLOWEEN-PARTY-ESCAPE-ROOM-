import React, { useState } from 'react';
import { isConfigured, saveRuntimeCredentials, clearRuntimeCredentials } from '../../lib/supabase';
import { seedInitialDataToSupabase } from '../../lib/dentalApi';
import {
  Database,
  X,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Key,
} from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  // Runtime credential inputs
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');

  if (!isOpen) return null;

  const sqlSchemaSnippet = `-- Aura Dental Studio: Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekday INTEGER NOT NULL UNIQUE,
    is_open BOOLEAN NOT NULL DEFAULT true,
    start_time TIME NOT NULL DEFAULT '08:30:00',
    end_time TIME NOT NULL DEFAULT '17:30:00'
);

CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin manage services" ON public.services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Public read clinic settings" ON public.clinic_settings FOR SELECT USING (true);
CREATE POLICY "Admin update clinic settings" ON public.clinic_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Public read business hours" ON public.business_hours FOR SELECT USING (true);
CREATE POLICY "Admin manage business hours" ON public.business_hours FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Public read blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admin manage blocked dates" ON public.blocked_dates FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Public create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Admin manage appointments" ON public.appointments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "User check admin status" ON public.admin_users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin manage admin_users" ON public.admin_users FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleRunSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const res = await seedInitialDataToSupabase();
    setSeedResult(res);
    setSeeding(false);
  };

  const handleSaveRuntimeCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl && customKey) {
      saveRuntimeCredentials(customUrl, customKey);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Supabase Integration & Database
              </h3>
              <p className="text-xs text-slate-500">
                Schema verification, real auth credentials, and table bootstrapping.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            isConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3 h-3 rounded-full ${
                isConfigured ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-amber-500'
              }`}
            />
            <span className="font-semibold text-sm">
              {isConfigured
                ? 'Active Live Supabase Connection'
                : 'Using Preview Fallback (VITE_SUPABASE_URL not yet configured)'}
            </span>
          </div>

          {isConfigured && (
            <button
              onClick={() => clearRuntimeCredentials()}
              className="text-xs font-semibold text-rose-700 hover:underline"
            >
              Reset Keys
            </button>
          )}
        </div>

        {/* Step 1: SQL Schema Script */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. SQL Schema Script (Exact Tables)
            </span>
            <button
              onClick={handleCopySql}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Paste into your Supabase Dashboard under <strong>SQL Editor</strong> to create all 6 tables:
            <code className="text-slate-700 font-mono text-[11px] ml-1">services</code>,{' '}
            <code className="text-slate-700 font-mono text-[11px]">appointments</code>,{' '}
            <code className="text-slate-700 font-mono text-[11px]">business_hours</code>,{' '}
            <code className="text-slate-700 font-mono text-[11px]">blocked_dates</code>,{' '}
            <code className="text-slate-700 font-mono text-[11px]">clinic_settings</code>, and{' '}
            <code className="text-slate-700 font-mono text-[11px]">admin_users</code>.
          </p>

          <pre className="p-3 bg-slate-900 text-slate-300 rounded-xl text-[11px] font-mono max-h-36 overflow-y-auto leading-relaxed">
            {sqlSchemaSnippet}
          </pre>
        </div>

        {/* Step 2: Seed Initial Data */}
        <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Seed Default Clinic Services & Hours
              </span>
              <p className="text-xs text-slate-500">
                Populates your Supabase project with initial dental services, business hours, and settings.
              </p>
            </div>
            <button
              onClick={handleRunSeed}
              disabled={seeding || !isConfigured}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{seeding ? 'Seeding...' : 'Seed Now'}</span>
            </button>
          </div>

          {seedResult && (
            <div
              className={`p-2.5 rounded-lg text-xs mt-2 ${
                seedResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {seedResult.message}
            </div>
          )}
        </div>

        {/* Step 3: Admin Auth Authorization Rule */}
        <div className="space-y-2 p-4 rounded-2xl bg-teal-50/50 border border-teal-200 text-xs text-teal-950">
          <div className="font-bold flex items-center gap-1.5 text-teal-800">
            <Key className="w-4 h-4 text-teal-700" />
            <span>3. How Admin Access is Checked</span>
          </div>
          <p className="leading-relaxed">
            When you log in via Supabase Auth, the system takes your authenticated user's ID
            (<code className="bg-teal-100/80 px-1 py-0.5 rounded font-mono">auth.user.id</code>) and verifies that
            it exists in the <code className="bg-teal-100/80 px-1 py-0.5 rounded font-mono">admin_users.user_id</code> table.
            To authorize your user as an admin in Supabase:
          </p>
          <pre className="p-2 bg-slate-900 text-slate-200 rounded-lg text-[11px] font-mono mt-1 overflow-x-auto">
            INSERT INTO public.admin_users (user_id) VALUES ('YOUR-SUPABASE-AUTH-USER-UUID');
          </pre>
        </div>

        {/* Step 4: Quick Preview Credentials Input */}
        {!isConfigured && (
          <form onSubmit={handleSaveRuntimeCreds} className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Or Enter Live Supabase Keys for Live Testing:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
              <input
                type="password"
                placeholder="eyJhbGciOi... (Anon Key)"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Save Keys & Reconnect
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
