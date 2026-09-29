import React, { useState, useEffect } from 'react';
import {
  Target,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Flag,
  XCircle,
  HelpCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { api, PhishingCampaign } from '../services/api.js';

export const PhishingSimulator: React.FC = () => {
  const [campaigns, setCampaigns] = useState<PhishingCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<PhishingCampaign | null>(null);
  const [simulationResult, setSimulationResult] = useState<{
    feedback: string;
    isSafe: boolean;
    redFlags: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
      if (data.length > 0) setSelectedCampaign(data[0]);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateAction = async (action: 'open' | 'report' | 'ignore' | 'click') => {
    if (!selectedCampaign) return;
    try {
      const res = await api.simulatePhishingAction(selectedCampaign.id, action);
      setSimulationResult(res);

      // Refresh campaigns to update live metrics
      const updatedList = await api.getCampaigns();
      setCampaigns(updatedList);
      const updatedSelected = updatedList.find((c) => c.id === selectedCampaign.id);
      if (updatedSelected) setSelectedCampaign(updatedSelected);
    } catch (err) {
      console.error('Simulation action error:', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
              Phishing Simulation & Drill Sandbox
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-semibold">
              SAFE SANDBOX (CONTAINED)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Safe employee training sandbox. Zero external emails sent; 100% contained within NETRAK.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start font-mono text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Synthetic Drill Environment</span>
        </div>
      </div>

      {/* Grid: Campaign Selector + Active Drill Sandbox */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Campaign List */}
        <div className="space-y-2.5">
          <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Available Simulation Drills ({campaigns.length})
          </span>
          {campaigns.map((camp) => {
            const isSelected = selectedCampaign?.id === camp.id;
            return (
              <button
                key={camp.id}
                onClick={() => {
                  setSelectedCampaign(camp);
                  setSimulationResult(null);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{camp.id}</span>
                  <span
                    className={`font-semibold uppercase ${
                      camp.difficulty === 'high'
                        ? 'text-rose-400'
                        : camp.difficulty === 'medium'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {camp.difficulty}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100 truncate">{camp.name}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{camp.scenario}</div>
              </button>
            );
          })}
        </div>

        {/* Right: Interactive Sandbox Email Preview */}
        <div className="md:col-span-2 space-y-4">
          {selectedCampaign ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
              {/* Email Envelope Header */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>From:</span>
                  <span className="text-rose-400 font-semibold">{selectedCampaign.sender}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subject:</span>
                  <span className="text-slate-200 font-bold">{selectedCampaign.subject}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Target:</span>
                  <span className="text-cyan-400">{selectedCampaign.targetGroup}</span>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-5 bg-slate-950/40 rounded-xl border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line">
                {selectedCampaign.body}

                <div className="pt-2">
                  <button
                    onClick={() => handleSimulateAction('click')}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all cursor-pointer"
                  >
                    {selectedCampaign.ctaText}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                  Simulate Your Decision:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleSimulateAction('report')}
                    className="py-2.5 px-3 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Flag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Report Phish</span>
                  </button>

                  <button
                    onClick={() => handleSimulateAction('open')}
                    className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => handleSimulateAction('click')}
                    className="py-2.5 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Click Lure</span>
                  </button>

                  <button
                    onClick={() => handleSimulateAction('ignore')}
                    className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-300 text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Ignore</span>
                  </button>
                </div>
              </div>

              {/* Simulation Result Debrief */}
              {simulationResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-3 animate-in fade-in duration-200 ${
                    simulationResult.isSafe
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {simulationResult.isSafe ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                    <span className="font-bold uppercase tracking-wider text-xs">
                      {simulationResult.isSafe ? 'Safe Decision Executed' : 'Caught in Phishing Drill!'}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-7">{simulationResult.feedback}</p>

                  <div className="pl-7 pt-1 space-y-1">
                    <span className="font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider block">
                      Phishing Red Flags Present:
                    </span>
                    {simulationResult.redFlags.map((flag, idx) => (
                      <div key={idx} className="text-slate-300 text-[11px]">
                        • {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Campaign Metrics */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                  Campaign Telemetry (Simulated Across Organization):
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Dispatched</div>
                    <div className="text-slate-100 font-bold mt-0.5">{selectedCampaign.metrics.simulated}</div>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Viewed</div>
                    <div className="text-cyan-400 font-bold mt-0.5">{selectedCampaign.metrics.viewed}</div>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Clicked (Failed)</div>
                    <div className="text-rose-400 font-bold mt-0.5">{selectedCampaign.metrics.clicked}</div>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Reported (Passed)</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{selectedCampaign.metrics.reported}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Select a campaign to run an interactive drill.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
