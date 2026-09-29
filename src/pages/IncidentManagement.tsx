import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  X,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { api, Incident } from '../services/api.js';
import { RiskBadge } from '../components/RiskBadge.js';

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, [statusFilter, severityFilter]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents({
        status: statusFilter,
        severity: severityFilter,
      });
      setIncidents(data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateIncidentStatus(id, newStatus);
      setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));
      if (selectedIncident?.id === id) {
        setSelectedIncident(updated);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
              Incident Management & SOC Triage
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40 font-semibold">
              TIER-1 / TIER-2 QUEUE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident response tracking, status transitions, and audit-logged actions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none pr-2 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="OPEN">Open Only</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none px-2 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="low">Low Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    Loading incident queue...
                  </td>
                </tr>
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No incidents match the active filters.
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {inc.id}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge severity={inc.severity} />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 capitalize">
                      {inc.type.replace('-', ' ')}
                    </td>
                    <td className="py-3 px-4 text-slate-200 max-w-xs truncate font-medium">
                      {inc.title}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <div>{inc.reporter}</div>
                      <div className="text-[10px] font-mono text-slate-500">{inc.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          inc.status === 'OPEN'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : inc.status === 'UNDER_REVIEW'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Status Transition Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm font-mono">
                    Incident Case Record: {selectedIncident.id}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Logged: {new Date(selectedIncident.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <RiskBadge severity={selectedIncident.severity} />
                <span className="font-mono text-slate-400 capitalize">
                  Type: {selectedIncident.type}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-100">{selectedIncident.title}</h4>
                <p className="text-slate-300 mt-1 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block mb-0.5">Reporter</span>
                  <div className="text-slate-200 font-semibold">{selectedIncident.reporter}</div>
                  <div className="text-slate-400 text-[11px]">{selectedIncident.email}</div>
                  <div className="text-slate-400 text-[11px]">{selectedIncident.department}</div>
                </div>

                <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block mb-0.5">Assigned To</span>
                  <div className="text-slate-200 font-semibold">{selectedIncident.assignedTo || 'Unassigned'}</div>
                  <span className="text-slate-500 uppercase text-[10px] block mt-1.5 mb-0.5">Affected Assets</span>
                  <div className="text-cyan-400 text-[11px]">{selectedIncident.affectedAssets.join(', ')}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono uppercase text-[10px] block mb-1">
                  Actions Taken Immediately
                </span>
                <p className="text-slate-300">{selectedIncident.immediateActions}</p>
              </div>

              {/* Status Update Actions */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
                  Advance Workflow Status:
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={selectedIncident.status === 'OPEN'}
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'OPEN')}
                    className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold cursor-pointer border transition-all ${
                      selectedIncident.status === 'OPEN'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Mark OPEN
                  </button>

                  <button
                    disabled={selectedIncident.status === 'UNDER_REVIEW'}
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'UNDER_REVIEW')}
                    className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold cursor-pointer border transition-all ${
                      selectedIncident.status === 'UNDER_REVIEW'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Set UNDER REVIEW
                  </button>

                  <button
                    disabled={selectedIncident.status === 'RESOLVED'}
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'RESOLVED')}
                    className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold cursor-pointer border transition-all ${
                      selectedIncident.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Mark RESOLVED
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
