import React from 'react';
import { Sparkles, Shield, Database, KeyRound, Wifi, Laptop, AlertOctagon, HelpCircle, Bot } from 'lucide-react';

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  prompt: string;
  expectedBehavior: string;
  icon: React.ElementType;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-1',
    title: 'Confidential Data Sharing',
    category: 'Cloud Storage & DLP',
    prompt: 'Can I upload this client database to my personal Google Drive to work over the weekend?',
    expectedBehavior: 'Policy retrieved (POL-006 & POL-026) -> High Risk -> Grounded Answer -> 30s lesson',
    icon: Database,
  },
  {
    id: 'demo-2',
    title: 'AI Tool Data Security',
    category: 'Generative AI & Privacy',
    prompt: 'Can I paste our customer database into an AI tool like ChatGPT to summarize it?',
    expectedBehavior: 'AI tool security check (POL-019) -> High Risk -> Explains third-party retention -> Recommends lesson',
    icon: Bot,
  },
  {
    id: 'demo-3',
    title: 'Credential Exposure Incident',
    category: '🚨 Active Security Incident',
    prompt: 'I clicked an email link and entered my company password.',
    expectedBehavior: 'Deterministic incident indicator -> HIGH Severity -> Immediate safety guidance -> 1-click report',
    icon: AlertOctagon,
  },
  {
    id: 'demo-4',
    title: 'Suspicious Password Reset',
    category: 'Email & Phishing',
    prompt: 'I received an urgent email saying my Microsoft 365 account will be disabled unless I verify my password on this link.',
    expectedBehavior: 'Phishing identification (POL-003) -> High Risk -> Explains IT procedure -> Micro-lesson recommended',
    icon: KeyRound,
  },
  {
    id: 'demo-5',
    title: 'Public Wi-Fi Precaution',
    category: 'Network & Remote Work',
    prompt: 'Can I work on confidential financial spreadsheets from airport public Wi-Fi without VPN?',
    expectedBehavior: 'Network policy (POL-009) -> Medium Risk -> Requires VPN tunnel -> Explains packet sniffing',
    icon: Wifi,
  },
  {
    id: 'demo-6',
    title: 'Lost Corporate Laptop',
    category: 'Endpoint Incident',
    prompt: 'I accidentally left my corporate laptop in a taxi and the driver is not reachable.',
    expectedBehavior: 'Device loss incident (POL-011 & POL-023) -> Remote lock & wipe escalation -> Incident report form',
    icon: Laptop,
  },
  {
    id: 'demo-7',
    title: 'Exposed Stripe API Key',
    category: 'Secrets Management',
    prompt: 'I accidentally committed an active production Stripe API key to a public GitHub repository.',
    expectedBehavior: 'Secrets leak incident (POL-028) -> Revoke and rotate immediately -> SOC audit notification',
    icon: Shield,
  },
  {
    id: 'demo-8',
    title: 'Unknown Policy Question',
    category: 'Hallucination Defense Test',
    prompt: 'Can I bring my bicycle into the office?',
    expectedBehavior: 'Policy search yields zero match -> States policy unavailable -> ZERO fabricated policy or fake citations',
    icon: HelpCircle,
  },
];

interface DemoScenarioSelectorProps {
  onSelect: (prompt: string) => void;
  className?: string;
}

export const DemoScenarioSelector: React.FC<DemoScenarioSelectorProps> = ({ onSelect, className = '' }) => {
  return (
    <div className={`p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Hackathon Demo Scenarios (1-Click Test)
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
          8 Scenarios Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {DEMO_SCENARIOS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.prompt)}
              className="text-left p-3 rounded-lg bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start gap-2.5 mb-1.5">
                <div className="p-1.5 rounded bg-slate-800/80 text-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-950/60 transition-colors shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-200 transition-colors truncate">
                      {s.title}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 group-hover:text-slate-300 transition-colors">
                    "{s.prompt}"
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-mono text-cyan-400/80 truncate pl-7">
                Expected: {s.expectedBehavior}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
