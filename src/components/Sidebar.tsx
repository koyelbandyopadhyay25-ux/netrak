import React from 'react';
import {
  LayoutDashboard,
  MessageSquareCode,
  GraduationCap,
  LineChart,
  AlertOctagon,
  Target,
  ShieldCheck,
  ClipboardList,
  BookOpenCheck,
  Compass,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const employeeNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'chat', label: 'Security Assistant', icon: MessageSquareCode, badge: 'Grounded' },
    { id: 'training', label: 'Just-in-Time Learning', icon: GraduationCap, count: '20' },
    { id: 'progress', label: 'Learning Progress', icon: LineChart },
    { id: 'phishing-simulator', label: 'Phishing Simulator', icon: Target },
    { id: 'incident-report', label: 'Report Incident', icon: AlertOctagon },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Command Center', icon: ShieldCheck },
    { id: 'incident-management', label: 'Incident Triage', icon: ClipboardList },
    { id: 'policy-management', label: 'Policy Knowledge Base', icon: BookOpenCheck, count: '40' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/50 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Employee Pillars */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Employee Platform
            </span>
          </div>
          <nav className="space-y-1">
            {employeeNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security Command Center Section */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400/90">
              Security Ops & Admin
            </span>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-950/40 text-amber-200 border border-amber-500/40 shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Tour / Product Pillars */}
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 mt-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture Pillars</span>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1 pl-1">
            <li>🛡️ Real-Time Guidance</li>
            <li>📖 Grounded Policy (40+)</li>
            <li>🎓 Just-in-Time Learning</li>
            <li>🚨 Deterministic Safety</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
