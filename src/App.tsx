import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  fetchServices,
  fetchClinicSettings,
  fetchBusinessHours,
  fetchBlockedDates,
  fetchAppointments,
  createService,
  updateService,
  updateAppointmentStatus,
  updateBusinessHour,
  addBlockedDate,
  deleteBlockedDate,
  updateClinicSettings,
} from './lib/dentalApi';
import {
  Service,
  ClinicSettings,
  BusinessHours,
  BlockedDate,
  Appointment,
  AppointmentStatus,
} from './types';
import { DEFAULT_CLINIC_SETTINGS } from './lib/mockData';
import { isConfigured } from './lib/supabase';

// Public Components
import { Header } from './components/common/Header';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { TechnologySection } from './components/public/TechnologySection';
import { BookingSection } from './components/public/BookingSection';
import { Footer } from './components/common/Footer';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminServices } from './components/admin/AdminServices';
import { AdminBusinessHours } from './components/admin/AdminBusinessHours';
import { AdminBlockedDates } from './components/admin/AdminBlockedDates';
import { AdminClinicSettings } from './components/admin/AdminClinicSettings';
import { SupabaseSetupModal } from './components/admin/SupabaseSetupModal';

function MainAppContent() {
  const { isAdmin, isLoading: authLoading } = useAuth();

  // Navigation mode: 'public' | 'admin-login' | 'admin-dashboard'
  const [viewMode, setViewMode] = useState<'public' | 'admin-login' | 'admin-dashboard'>('public');
  const [adminTab, setAdminTab] = useState<string>('overview');
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // App Data State
  const [services, setServices] = useState<Service[]>([]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(DEFAULT_CLINIC_SETTINGS);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Booking Flow Service Selection
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      const [srvs, stgs, bHours, bDates, apts] = await Promise.all([
        fetchServices(false),
        fetchClinicSettings(),
        fetchBusinessHours(),
        fetchBlockedDates(),
        fetchAppointments(),
      ]);

      setServices(srvs);
      setClinicSettings(stgs);
      setBusinessHours(bHours);
      setBlockedDates(bDates);
      setAppointments(apts);
    } catch (err) {
      console.error('Error loading clinic data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Sync viewMode when auth changes
  useEffect(() => {
    if (isAdmin && viewMode === 'admin-login') {
      setViewMode('admin-dashboard');
    }
  }, [isAdmin, viewMode]);

  // Smooth scroll to booking
  const scrollToBooking = (preselected?: Service) => {
    if (preselected) {
      setSelectedServiceForBooking(preselected);
    }
    setViewMode('public');
    setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Scroll to services
  const scrollToServices = () => {
    setViewMode('public');
    setTimeout(() => {
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Handler for appointment creation
  const handleAppointmentCreated = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  // Admin Operations
  const handleCreateService = async (data: Omit<Service, 'id' | 'created_at'>) => {
    const created = await createService(data);
    setServices((prev) => [...prev, created]);
  };

  const handleUpdateService = async (id: string, updates: Partial<Service>) => {
    const updated = await updateService(id, updates);
    if (updated) {
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await updateAppointmentStatus(id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleUpdateBusinessHour = async (id: string, updates: Partial<BusinessHours>) => {
    await updateBusinessHour(id, updates);
    setBusinessHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const handleAddBlockedDate = async (date: string, reason?: string) => {
    const added = await addBlockedDate(date, reason);
    setBlockedDates((prev) => [...prev, added]);
  };

  const handleDeleteBlockedDate = async (id: string) => {
    await deleteBlockedDate(id);
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateSettings = async (updates: Partial<ClinicSettings>) => {
    const updated = await updateClinicSettings(updates);
    setClinicSettings(updated);
  };

  // Check which screen to render
  if (viewMode === 'admin-login') {
    return (
      <>
        <AdminLogin
          onBackToWebsite={() => setViewMode('public')}
          onOpenSupabaseSetup={() => setSupabaseModalOpen(true)}
        />
        <SupabaseSetupModal
          isOpen={supabaseModalOpen}
          onClose={() => setSupabaseModalOpen(false)}
        />
      </>
    );
  }

  if (viewMode === 'admin-dashboard') {
    // If not admin, route back to login
    if (!isAdmin && !authLoading) {
      return (
        <AdminLogin
          onBackToWebsite={() => setViewMode('public')}
          onOpenSupabaseSetup={() => setSupabaseModalOpen(true)}
        />
      );
    }

    return (
      <>
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={setAdminTab}
          onViewPublicSite={() => setViewMode('public')}
          onOpenSupabaseSetup={() => setSupabaseModalOpen(true)}
          settings={clinicSettings}
        >
          {adminTab === 'overview' && (
            <AdminOverview
              appointments={appointments}
              services={services}
              businessHours={businessHours}
              onNavigateToTab={setAdminTab}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            />
          )}

          {adminTab === 'appointments' && (
            <AdminAppointments
              appointments={appointments}
              services={services}
              onUpdateStatus={handleUpdateAppointmentStatus}
            />
          )}

          {adminTab === 'services' && (
            <AdminServices
              services={services}
              onCreateService={handleCreateService}
              onUpdateService={handleUpdateService}
            />
          )}

          {adminTab === 'business-hours' && (
            <AdminBusinessHours
              businessHours={businessHours}
              onUpdateBusinessHour={handleUpdateBusinessHour}
            />
          )}

          {adminTab === 'blocked-dates' && (
            <AdminBlockedDates
              blockedDates={blockedDates}
              onAddBlockedDate={handleAddBlockedDate}
              onDeleteBlockedDate={handleDeleteBlockedDate}
            />
          )}

          {adminTab === 'settings' && (
            <AdminClinicSettings
              settings={clinicSettings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </AdminLayout>

        <SupabaseSetupModal
          isOpen={supabaseModalOpen}
          onClose={() => setSupabaseModalOpen(false)}
        />
      </>
    );
  }

  // Otherwise: Public Website
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Banner if Supabase URL is unconfigured */}
      {!isConfigured && (
        <aside aria-label="Development environment notice" className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 max-w-3xl truncate">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-slate-300 truncate">
              Supabase credentials not yet provided in <code className="text-teal-300 font-mono">.env</code>.
              Running with interactive preview data.
            </span>
          </div>
          <button
            onClick={() => setSupabaseModalOpen(true)}
            className="text-teal-400 hover:text-teal-300 font-semibold underline text-xs shrink-0 ml-4"
          >
            Database Setup & SQL
          </button>
        </aside>
      )}

      {/* Primary Top Bar */}
      <Header
        settings={clinicSettings}
        onBookClick={() => scrollToBooking()}
        onAdminClick={() => setViewMode(isAdmin ? 'admin-dashboard' : 'admin-login')}
        isAdmin={isAdmin}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          settings={clinicSettings}
          onBookClick={() => scrollToBooking()}
          onExploreServices={() => scrollToServices()}
        />

        {/* Services Section */}
        <ServicesSection
          services={services}
          onSelectService={(srv) => scrollToBooking(srv)}
        />

        {/* Clinical Philosophy & About */}
        <AboutSection />

        {/* Advanced Technology & Safety */}
        <TechnologySection />

        {/* Booking Experience Wizard */}
        <BookingSection
          services={services}
          selectedService={selectedServiceForBooking}
          onSelectService={setSelectedServiceForBooking}
          settings={clinicSettings}
          businessHours={businessHours}
          blockedDates={blockedDates}
          appointments={appointments}
          onAppointmentCreated={handleAppointmentCreated}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={clinicSettings}
        businessHours={businessHours}
        onAdminClick={() => setViewMode(isAdmin ? 'admin-dashboard' : 'admin-login')}
        onBookClick={() => scrollToBooking()}
      />

      {/* Setup Helper Modal */}
      <SupabaseSetupModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
