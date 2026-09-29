import React from 'react';
import { Shield, Sparkles, AlertOctagon, Terminal, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenDemoScenarios: () => void;
  onOpenIncidentModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenDemoScenarios,
  onOpenIncidentModal,
}) => {
  const isAdminView = currentTab.startsWith('admin') || currentTab.includes('management');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-slate-100 font-mono">
                  NETRAK
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                  SECURITY COPILOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight">
                Understand. Decide. Learn. Stay Secure.
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls & Mode Switch */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode Button */}
          <button
            onClick={onOpenDemoScenarios}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm shadow-cyan-950"
            title="Open 1-Click Hackathon Scenarios"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demo Scenarios</span>
          </button>

          {/* Quick Incident Escalation */}
          <button
            onClick={onOpenIncidentModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Report Incident</span>
          </button>

          {/* View Toggle */}
          <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          <button
            onClick={() => onTabChange(isAdminView ? 'dashboard' : 'admin-dashboard')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
              isAdminView
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isAdminView ? 'Switch to Employee View' : 'Command Center (Admin)'}</span>
          </button>

          {/* User Persona */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[11px] text-slate-200 font-semibold leading-tight">Demo Employee</div>
              <div className="text-[10px] text-slate-400 leading-tight">Operations</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
