import React from 'react';
import {
  Shield,
  MessageSquareCode,
  AlertOctagon,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

interface LandingProps {
  onNavigate: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenDemoScenarios: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  onNavigate,
  onOpenReportModal,
  onOpenDemoScenarios,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16 animate-in fade-in duration-200">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-xs font-mono shadow-sm">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>NETRAK · HUMAN-CENTRIC SECURITY DECISION PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight font-sans">
          Your Security Awareness Copilot
        </h1>

        <p className="text-lg text-cyan-300 font-medium font-sans">
          "Understand. Decide. Learn. Stay Secure."
        </p>

        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
          NETRAK combines human-designed security rules, organizational policy,
          deterministic risk analysis, and selective AI assistance to help employees make
          safer decisions the exact moment they face a cybersecurity question.
        </p>

        {/* 4 Main Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('chat')}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-950/60 transition-all cursor-pointer flex items-center gap-2"
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>Ask NETRAK</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-950/60 transition-all cursor-pointer flex items-center gap-2"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Report Incident</span>
          </button>

          <button
            onClick={() => onNavigate('training')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Learn Security</span>
          </button>

          <button
            onClick={onOpenDemoScenarios}
            className="px-6 py-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Try Demo Scenarios</span>
          </button>
        </div>
      </div>

      {/* 3 Major Product Pillars */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Three Product Pillars
          </h2>
          <p className="text-lg font-bold text-slate-200 mt-0.5">
            One security decision at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                🛡️ REAL-TIME GUIDANCE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Never wait months for an annual refresher. Ask about customer data in AI tools,
                suspicious emails, or airport Wi-Fi and receive grounded, human-like guidance.
              </p>
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1.5 pt-2 cursor-pointer hover:underline"
            >
              <span>Explore Security Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                🎓 JUST-IN-TIME LEARNING
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                30-second micro-lessons paired with realistic decision dilemmas.
                Adaptive learning identifies weak domains and suggests refresher drills automatically.
              </p>
            </div>
            <button
              onClick={() => onNavigate('training')}
              className="text-xs font-mono font-semibold text-blue-400 flex items-center gap-1.5 pt-2 cursor-pointer hover:underline"
            >
              <span>Start 30-Sec Drill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                🚨 INCIDENT RESPONSE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Deterministic detection catches credential inputs, lost devices, or leaked API keys
                first — providing instant emergency isolation steps and routing directly to the SOC.
              </p>
            </div>
            <button
              onClick={onOpenReportModal}
              className="text-xs font-mono font-semibold text-rose-400 flex items-center gap-1.5 pt-2 cursor-pointer hover:underline"
            >
              <span>Report Security Incident</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Rules First · Grounded Policy (40+) · Selective AI · Containment Sandbox</span>
        </div>
        <button
          onClick={() => onNavigate('admin-dashboard')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
        >
          View Command Center (Admin) →
        </button>
      </div>
    </div>
  );
};
