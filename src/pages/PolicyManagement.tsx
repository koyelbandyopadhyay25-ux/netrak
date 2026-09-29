import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  Search,
  GitCompare,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
} from 'lucide-react';
import { api, Policy } from '../services/api.js';

export const PolicyManagement: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showVersionDiff, setShowVersionDiff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await api.getPolicies();
      setPolicies(data);
      if (data.length > 0) setSelectedPolicy(data[0]);
    } catch (err) {
      console.error('Failed to load policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = policies.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.section.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.rule.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
              Corporate Policy Knowledge Base
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-semibold">
              40 POLICIES ACTIVE (v1.2)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative corporate security standards repository backing all NETRAK decision engines.
          </p>
        </div>

        <button
          onClick={() => setShowVersionDiff(!showVersionDiff)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
            showVersionDiff
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-500/40'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5 text-amber-400" />
          <span>{showVersionDiff ? 'Hide Version Diff' : 'Compare v1.1 vs v1.2'}</span>
        </button>
      </div>

      {/* Version Diff Comparison Banner */}
      {showVersionDiff && (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <GitCompare className="w-4 h-4" />
              <span>Policy Revision Diff: v1.1 → v1.2 (Active Production)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Published: September 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-rose-400 font-bold uppercase text-[11px]">
                Sec 9.1: Generative AI Tool Governance (Modified)
              </span>
              <div className="text-slate-400 line-through">
                Old (v1.1): Employees may use AI tools for public document drafting with manager approval.
              </div>
              <div className="text-emerald-300 font-medium">
                New (v1.2): Pasting Confidential or Restricted data, customer records, or proprietary source code into public AI tools is strictly prohibited without zero-retention enterprise agreements.
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-rose-400 font-bold uppercase text-[11px]">
                Sec 4.3: External File Sharing Controls (Strengthened)
              </span>
              <div className="text-slate-400 line-through">
                Old (v1.1): External shares should be password protected where feasible.
              </div>
              <div className="text-emerald-300 font-medium">
                New (v1.2): Anonymous 'anyone with the link' public links are strictly banned. Sharing requires recipient email authentication and mandatory expiration dates.
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>Downstream Affected Modules:</span>
            <div className="flex gap-2">
              <span className="text-cyan-400">2 Chatbot Rules</span> ·
              <span className="text-cyan-400">2 Micro-Lessons (LES-004, LES-005)</span> ·
              <span className="text-cyan-400">2 Scenarios (SCN-001, SCN-002)</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 40 policies by keyword, topic, rule, or section (e.g., 'ChatGPT', 'Sec 4.5', 'USB', 'MFA')..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
        />
      </div>

      {/* Two-Column Explorer: List + Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Policy List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map((p) => {
            const isSelected = selectedPolicy?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPolicy(p)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{p.section}</span>
                  <span className="text-cyan-400">{p.id}</span>
                </div>
                <div className="text-xs font-bold text-slate-100 leading-snug truncate">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Domain: {p.topic}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed View */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
          {selectedPolicy ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
                <span className="text-cyan-400 font-bold">{selectedPolicy.id}</span>
                <span className="text-slate-400">{selectedPolicy.section}</span>
              </div>

              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
                  {selectedPolicy.topic}
                </span>
                <h3 className="text-xl font-bold text-slate-100">{selectedPolicy.title}</h3>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-mono text-cyan-400 font-bold text-xs uppercase tracking-wider block">
                  Mandatory Policy Requirement:
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {selectedPolicy.rule}
                </p>
              </div>

              <div className="space-y-1 text-xs leading-relaxed">
                <span className="font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  Security Rationale (Why It Matters):
                </span>
                <p className="text-slate-300">{selectedPolicy.explanation}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="font-mono text-slate-400 font-bold text-[11px] uppercase tracking-wider block mb-2">
                  Semantic Indexing Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPolicy.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-mono text-[10px]"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Select a policy to view full verified specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
