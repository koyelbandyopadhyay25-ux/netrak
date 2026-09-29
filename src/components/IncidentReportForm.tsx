import React, { useState } from 'react';
import { X, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api, Incident } from '../services/api.js';

interface IncidentReportFormProps {
  initialTitle?: string;
  initialType?: string;
  initialSeverity?: 'low' | 'medium' | 'high';
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (incident: Incident) => void;
}

export const IncidentReportForm: React.FC<IncidentReportFormProps> = ({
  initialTitle = '',
  initialType = 'phishing-click',
  initialSeverity = 'high',
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [title, setTitle] = useState(initialTitle || 'Suspected Security Event');
  const [type, setType] = useState(initialType || 'phishing-click');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>(initialSeverity || 'high');
  const [description, setDescription] = useState('');
  const [affectedAssets, setAffectedAssets] = useState('Employee Laptop, Microsoft 365');
  const [immediateActions, setImmediateActions] = useState('Disconnected network connection.');
  const [reporterName, setReporterName] = useState('Demo Employee');
  const [reporterEmail, setReporterEmail] = useState('employee@corp.netrak.internal');
  const [submitting, setSubmitting] = useState(false);
  const [successIncident, setSuccessIncident] = useState<Incident | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createIncident({
        title,
        type,
        severity,
        description: description || 'Employee submitted incident details via NETRAK portal.',
        affectedAssets: affectedAssets.split(',').map((s) => s.trim()),
        immediateActions,
        reporter: reporterName,
        email: reporterEmail,
      });
      setSuccessIncident(created);
      if (onSubmitted) onSubmitted(created);
    } catch (err) {
      console.error('Failed to submit incident:', err);
      alert('Unable to submit incident report. Please contact the security hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-rose-500/40 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">
                Security Incident Escalation Report
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Mandatory 60-Minute Incident Reporting (Sec 1.2)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successIncident ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">
              Incident {successIncident.id} Registered
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your incident report has been securely registered in the corporate SOC queue.
              Status is currently <span className="font-mono text-emerald-400 font-bold">OPEN</span>.
              A security analyst will review this record.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg text-xs font-mono text-slate-400 max-w-sm mx-auto text-left space-y-1">
              <div>Incident ID: <span className="text-slate-200">{successIncident.id}</span></div>
              <div>Assigned: <span className="text-slate-200">{successIncident.assignedTo}</span></div>
              <div>Severity: <span className="text-rose-400 uppercase font-semibold">{successIncident.severity}</span></div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Incident Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="phishing-click">Phishing Link / Credential Form</option>
                  <option value="credential-exposure">Credential / Password Exposure</option>
                  <option value="suspicious-download">Suspicious Download / Executable</option>
                  <option value="lost-device">Lost or Stolen Corporate Device</option>
                  <option value="exposed-secret">Exposed API Key / Public Git Secret</option>
                  <option value="data-exposure">Accidental Data Exposure / Misdirected Email</option>
                  <option value="MFA-abuse">MFA Push Fatigue / Unauthorized Approval</option>
                  <option value="malware">Suspected Malware / System Anomaly</option>
                  <option value="other">Other Security Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Estimated Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="high">HIGH — Active compromise or leaked credentials</option>
                  <option value="medium">MEDIUM — Suspicious file or unverified prompt</option>
                  <option value="low">LOW — Minor anomaly or isolated observation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Brief Headline
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Clicked suspicious tracking link and entered corporate password"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                What Happened? (Detailed Description)
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include link URL, sender address, what was entered or clicked, and any unusual behavior observed."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Affected Assets / Systems
                </label>
                <input
                  type="text"
                  value={affectedAssets}
                  onChange={(e) => setAffectedAssets(e.target.value)}
                  placeholder="Laptop, GitHub, Stripe, Okta"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Actions Taken Immediately
                </label>
                <input
                  type="text"
                  value={immediateActions}
                  onChange={(e) => setImmediateActions(e.target.value)}
                  placeholder="Disconnected Wi-Fi, rotated key, etc."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                Log will be stored in audit records.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer shadow-lg shadow-rose-950/50 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Transmitting...' : 'Transmit Report to SOC'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
