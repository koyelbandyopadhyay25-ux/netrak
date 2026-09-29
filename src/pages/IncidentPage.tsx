import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  WifiOff,
  KeyRound,
  FileX,
  PhoneCall,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { api, Incident } from '../services/api.js';

export const IncidentPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('phishing-click');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('high');
  const [description, setDescription] = useState('');
  const [affectedAssets, setAffectedAssets] = useState('Corporate Laptop, Microsoft 365');
  const [immediateActions, setImmediateActions] = useState('Disconnected from corporate Wi-Fi.');
  const [reporterName, setReporterName] = useState('Demo Employee');
  const [reporterEmail, setReporterEmail] = useState('employee@corp.netrak.internal');
  const [department, setDepartment] = useState('Operations');
  const [submitting, setSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createIncident({
        title: title || 'Reported Security Concern',
        type,
        severity,
        description,
        affectedAssets: affectedAssets.split(',').map((s) => s.trim()),
        immediateActions,
        reporter: reporterName,
        email: reporterEmail,
        department,
      });
      setSubmittedIncident(created);
    } catch (err) {
      console.error('Error reporting incident:', err);
      alert('Unable to submit incident report. Please call the emergency hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
              Security Incident Escalation Portal
            </h1>
            <p className="text-xs text-rose-300 font-mono">
              Corporate Policy Sec 1.2: Mandatory reporting within 60 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Triage First Steps */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Stop & Follow These Emergency Isolation Steps:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-mono">
              <WifiOff className="w-4 h-4" />
              <span>1. Disconnect Network</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Disconnect from Wi-Fi immediately or pull your wired ethernet cable to stop active malware command & control.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-mono">
              <KeyRound className="w-4 h-4" />
              <span>2. Reset Password</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              If credentials were typed, immediately change your password from a known clean device (such as your smartphone).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-mono">
              <FileX className="w-4 h-4" />
              <span>3. Preserve Evidence</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Leave your machine powered on. Do not delete files or restart; the SOC forensic team needs volatile memory intact.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation State or Form */}
      {submittedIncident ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center space-y-4 shadow-2xl">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            Incident Registered: {submittedIncident.id}
          </h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Your report has been dispatched to the Security Operations Center (SOC) triage queue.
            Status is <span className="font-mono text-emerald-400 font-bold">OPEN</span>.
            An on-duty incident commander will investigate.
          </p>
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 max-w-md mx-auto text-left space-y-1.5">
            <div>Incident ID: <span className="text-slate-200">{submittedIncident.id}</span></div>
            <div>Reported By: <span className="text-slate-200">{submittedIncident.reporter} ({submittedIncident.department})</span></div>
            <div>Severity: <span className="text-rose-400 uppercase font-bold">{submittedIncident.severity}</span></div>
            <div>Assigned To: <span className="text-slate-200">{submittedIncident.assignedTo}</span></div>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedIncident(null);
                setTitle('');
                setDescription('');
              }}
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
                Incident Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="phishing-click">Phishing Link Clicked / Credential Submission</option>
                <option value="credential-exposure">Password or MFA Credential Exposure</option>
                <option value="suspicious-download">Suspicious Download / Ransomware / Macro</option>
                <option value="lost-device">Lost or Stolen Laptop / Mobile Device</option>
                <option value="exposed-secret">Exposed API Key / Public GitHub Commit</option>
                <option value="data-exposure">Accidental Customer Data Disclosure</option>
                <option value="MFA-abuse">MFA Bombardment / Unexpected Push Prompt</option>
                <option value="malware">Malware or Rogue Browser Extension</option>
                <option value="other">Other Security Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
                Initial Severity Assessment
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="high">HIGH — Credentials typed, secret exposed, device lost</option>
                <option value="medium">MEDIUM — Suspicious file opened, unverified prompt</option>
                <option value="low">LOW — Minor anomaly or isolated observation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
              Incident Summary (Headline)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Clicked shipping notice link and typed Microsoft 365 credentials"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
              Detailed Description (Include exact URLs, sender addresses, timestamps)
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide full details of what happened, what links you clicked, any files downloaded, or messages received..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
                Affected Systems & Assets
              </label>
              <input
                type="text"
                value={affectedAssets}
                onChange={(e) => setAffectedAssets(e.target.value)}
                placeholder="Laptop #LT-401, Okta Account, Slack"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
                Immediate Actions You Took
              </label>
              <input
                type="text"
                value={immediateActions}
                onChange={(e) => setImmediateActions(e.target.value)}
                placeholder="Disconnected Wi-Fi, changed password, closed tab"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>SOC 24/7 Hotline: Ext. 4444 (Toll-Free: 1-800-NETRAK-SEC)</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting Incident...' : 'Transmit Report to SOC'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
