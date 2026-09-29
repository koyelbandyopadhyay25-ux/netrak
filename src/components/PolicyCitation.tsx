import React, { useState } from 'react';
import { BookOpen, ExternalLink, X, Shield } from 'lucide-react';
import { api, Policy } from '../services/api.js';

interface PolicyCitationProps {
  reference: {
    id: string;
    section: string;
    title: string;
  };
}

export const PolicyCitation: React.FC<PolicyCitationProps> = ({ reference }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [policyDetail, setPolicyDetail] = useState<Policy | null>(null);

  const handleOpen = async () => {
    setModalOpen(true);
    if (!policyDetail) {
      setLoading(true);
      try {
        const policies = await api.getPolicies();
        const found = policies.find((p) => p.id === reference.id || p.section === reference.section);
        if (found) setPolicyDetail(found);
      } catch (err) {
        console.error('Error fetching policy details:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-mono hover:bg-cyan-900/50 hover:border-cyan-400/60 transition-all cursor-pointer group text-left"
        title="View full policy rule & section"
      >
        <BookOpen className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="font-semibold">{reference.section || reference.id}</span>
        <span className="text-slate-400 truncate max-w-[200px]">{reference.title}</span>
        <ExternalLink className="w-3 h-3 text-cyan-400/70 ml-0.5" />
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
                  Corporate Security Policy
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {loading ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Loading verified policy details...
                </div>
              ) : policyDetail ? (
                <>
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>{policyDetail.id}</span>
                    <span>{policyDetail.section}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">
                      {policyDetail.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Domain: {policyDetail.topic}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                    <p className="text-xs uppercase font-mono tracking-wider text-cyan-400/80 mb-1.5 font-bold">
                      Mandatory Rule:
                    </p>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      {policyDetail.rule}
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-300">Why It Matters: </span>
                    {policyDetail.explanation}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {policyDetail.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-cyan-400">{reference.id}</div>
                  <h4 className="text-base font-bold text-slate-100">{reference.title}</h4>
                  <p className="text-sm text-slate-300">Section: {reference.section}</p>
                  <p className="text-xs text-slate-400">Full verified reference in corporate repository.</p>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
