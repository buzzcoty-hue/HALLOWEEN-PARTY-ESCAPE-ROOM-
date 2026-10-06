import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isConfigured } from '../lib/supabase';
import { verifyAdminAccess } from '../lib/dentalApi';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isCheckingAdmin: boolean;
  adminError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  demoSignIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Check user admin status using admin_users.user_id
  const checkAdminStatus = async (userId: string) => {
    setIsCheckingAdmin(true);
    setAdminError(null);
    try {
      const authorized = await verifyAdminAccess(userId);
      if (authorized) {
        setIsAdmin(true);
        setAdminError(null);
      } else {
        setIsAdmin(false);
        setAdminError('You are signed in, but you are not authorized as an admin.');
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
      setAdminError('An error occurred while validating admin privileges.');
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isConfigured) {
        // Offline preview mode: check if local demo admin session exists
        const demoAuth = localStorage.getItem('aura_demo_admin_logged_in');
        if (demoAuth === 'true' && mounted) {
          setIsAdmin(true);
          setUser({
            id: 'demo-admin-usr-01',
            email: 'admin@auradentalstudio.com',
            app_metadata: {},
            user_metadata: { full_name: 'Dr. Evelyn Vance, DDS' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as unknown as User);
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user?.id) {
            await checkAdminStatus(session.user.id);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    if (isConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!mounted) return;
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user?.id) {
            await checkAdminStatus(newSession.user.id);
          } else {
            setIsAdmin(false);
            setAdminError(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAdminError(null);

    if (!isConfigured) {
      // In unconfigured state, if someone signs in with standard credentials:
      if (email.trim() && password.trim()) {
        localStorage.setItem('aura_demo_admin_logged_in', 'true');
        setUser({
          id: 'demo-admin-usr-01',
          email: email.trim(),
          app_metadata: {},
          user_metadata: { full_name: 'Dr. Evelyn Vance, DDS' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User);
        setIsAdmin(true);
        return { success: true };
      }
      return { success: false, error: 'Please enter a valid email and password.' };
    }

    setIsCheckingAdmin(true);
    try {
      // 1. Sign in with supabase.auth.signInWithPassword()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setIsCheckingAdmin(false);
        return {
          success: false,
          error: error?.message || 'Invalid login credentials.',
        };
      }

      setUser(data.user);
      setSession(data.session);

      // 2. Check if user.id exists in admin_users.user_id
      const authorized = await verifyAdminAccess(data.user.id);
      setIsCheckingAdmin(false);

      if (!authorized) {
        setIsAdmin(false);
        const msg = 'You are signed in, but you are not authorized as an admin.';
        setAdminError(msg);
        return { success: false, error: msg };
      }

      setIsAdmin(true);
      return { success: true };
    } catch (err: unknown) {
      setIsCheckingAdmin(false);
      const errMsg = err instanceof Error ? err.message : 'An error occurred during authentication.';
      return { success: false, error: errMsg };
    }
  };

  const demoSignIn = () => {
    localStorage.setItem('aura_demo_admin_logged_in', 'true');
    setUser({
      id: 'demo-admin-usr-01',
      email: 'admin@auradentalstudio.com',
      app_metadata: {},
      user_metadata: { full_name: 'Dr. Evelyn Vance, DDS' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User);
    setIsAdmin(true);
    setAdminError(null);
  };

  const signOut = async () => {
    localStorage.removeItem('aura_demo_admin_logged_in');
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAdminError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        isCheckingAdmin,
        adminError,
        signIn,
        signOut,
        demoSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
