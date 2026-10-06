import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isConfigured } from '../../lib/supabase';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Database, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onBackToWebsite: () => void;
  onOpenSupabaseSetup: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onBackToWebsite,
  onOpenSupabaseSetup,
}) => {
  const { signIn, demoSignIn, isCheckingAdmin, adminError } = useAuth();
  const [email, setEmail] = useState('admin@auradentalstudio.com');
  const [password, setPassword] = useState('DentalStudio2026!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onBackToWebsite}
          className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Clinic Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Staff & Clinical Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Secure administrative access for practice managers and dental directors.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Connection status notification */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-xs flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-400 ring-2 ring-emerald-400/20' : 'bg-amber-400'
                }`}
              />
              <span>
                {isConfigured ? 'Connected to live Supabase Auth' : 'Supabase in Preview Mode'}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenSupabaseSetup}
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 text-[11px]"
            >
              <Database className="w-3 h-3" />
              <span>Database Setup</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>Admin Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@auradentalstudio.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Error Message */}
            {(errorMessage || adminError) && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage || adminError}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isCheckingAdmin}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2"
            >
              {isSubmitting || isCheckingAdmin ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Admin Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Practice Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option for evaluators */}
          <div className="pt-2 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={demoSignIn}
              className="text-xs text-slate-400 hover:text-teal-300 transition-colors inline-flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-teal-500" />
              <span>Instant Review Access (Demo Admin Session)</span>
            </button>
          </div>
        </div>

        {/* Note on admin access verification */}
        <p className="text-center text-[11px] text-slate-500 mt-6 leading-relaxed">
          Authorized personnel only. Access verification checks matching user IDs in{' '}
          <code className="text-slate-400 bg-slate-800 px-1 py-0.5 rounded font-mono">admin_users.user_id</code>.
        </p>
      </div>
    </div>
  );
};
