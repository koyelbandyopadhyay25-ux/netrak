import React from 'react';
import { AlertOctagon, CheckSquare, ArrowRight, ShieldAlert } from 'lucide-react';

interface IncidentAlertProps {
  incidentType: string;
  severity: 'low' | 'medium' | 'high';
  riskIndicators: string[];
  recommendedAction: string;
  onReportClick: () => void;
}

export const IncidentAlert: React.FC<IncidentAlertProps> = ({
  incidentType,
  severity,
  riskIndicators,
  recommendedAction,
  onReportClick,
}) => {
  return (
    <div className="my-4 rounded-xl border border-rose-500/50 bg-gradient-to-b from-rose-950/40 to-slate-950 p-5 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3.5 mb-3.5">
        <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
          <AlertOctagon className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
              Security Alert Escalation
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase font-semibold">
              {severity} SEVERITY
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-0.5">
            Stop here for a moment — this may need immediate action.
          </h3>
          <p className="text-xs text-rose-200/80 mt-1">
            Potential incident pattern identified: <span className="font-mono text-rose-300 font-semibold">{incidentType || 'unauthorized-event'}</span>
          </p>
        </div>
      </div>

      {riskIndicators.length > 0 && (
        <div className="mb-4 p-3 bg-slate-900/80 rounded-lg border border-rose-900/40 space-y-1.5">
          <span className="text-xs font-semibold text-rose-300 font-mono flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Detected Risk Indicators:
          </span>
          {riskIndicators.map((ind, i) => (
            <p key={i} className="text-xs text-slate-300 pl-5">
              • {ind}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-2 mb-4 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-rose-400" />
          Immediate Action Required:
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {recommendedAction}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400 font-mono">
          Mandatory escalation under Sec 1.2 (within 60 mins)
        </span>
        <button
          onClick={onReportClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-rose-950/50 transition-all cursor-pointer hover:translate-x-0.5"
        >
          <span>Report Incident to SOC</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
