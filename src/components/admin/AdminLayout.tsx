import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClinicSettings } from '../../types';
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Clock,
  CalendarOff,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Database,
  Building2,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onViewPublicSite: () => void;
  onOpenSupabaseSetup: () => void;
  settings: ClinicSettings;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewPublicSite,
  onOpenSupabaseSetup,
  settings,
  children,
}) => {
  const { user, signOut } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'business-hours', label: 'Business Hours', icon: Clock },
    { id: 'blocked-dates', label: 'Blocked Dates', icon: CalendarOff },
    { id: 'settings', label: 'Clinic Settings', icon: Settings },
  ];

  const currentItem = navItems.find((n) => n.id === currentTab) || navItems[0];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar (w-64) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Practice Branding Header */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-teal-500/20">
                A
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-white text-sm truncate">
                  {settings.clinic_name || 'Aura Dental'}
                </div>
                <div className="text-[11px] text-teal-400 font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Practice Console</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with user & actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={onOpenSupabaseSetup}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-teal-300 bg-teal-950/40 hover:bg-teal-900/60 border border-teal-800/60 rounded-xl transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>Database & Schema</span>
          </button>

          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>View Public Website</span>
          </button>

          {/* User profile */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-teal-400 border border-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.email?.charAt(0).toUpperCase() || 'D'}
              </div>
              <div className="truncate text-[11px]">
                <div className="font-semibold text-white truncate">
                  {user?.user_metadata?.full_name || 'Clinic Director'}
                </div>
                <div className="text-slate-500 truncate">{user?.email}</div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <span className="font-medium text-slate-700 hidden sm:inline">
                {settings.clinic_name}
              </span>
              <span className="hidden sm:inline">/</span>
              <span className="font-bold text-slate-900">{currentItem.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Public Website</span>
            </button>

            <button
              onClick={signOut}
              className="inline-flex lg:hidden items-center p-2 text-slate-500 hover:text-rose-600 rounded-lg"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <div className="relative w-72 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <span className="font-bold text-white text-sm">{settings.clinic_name}</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="py-6 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onOpenSupabaseSetup();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-teal-300 bg-teal-950/40 rounded-xl"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Database & Schema</span>
              </button>

              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onViewPublicSite();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-xl"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </button>

              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 bg-rose-950/30 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
