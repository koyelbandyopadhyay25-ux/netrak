import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  severity: 'low' | 'medium' | 'high';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, className = '' }) => {
  if (severity === 'high') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 ${className}`}>
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        HIGH RISK
      </span>
    );
  }

  if (severity === 'medium') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        MODERATE RISK
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      SAFE / LOW RISK
    </span>
  );
};
