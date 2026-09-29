import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Target,
  GraduationCap,
  Users,
  Bot,
  Send,
  AlertTriangle,
  Sparkles,
  BarChart3,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import { api, DashboardMetrics } from '../services/api.js';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [adminQuestion, setAdminQuestion] = useState('');
  const [adminChatHistory, setAdminChatHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: "Welcome, Security Commander. I am your Command Center AI Advisor. Ask me anything regarding organizational security awareness, incident patterns, or training gaps grounded in your live metrics.",
    },
  ]);
  const [askingAdminAI, setAskingAdminAI] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAdmin = async (questionToAsk?: string) => {
    const q = (questionToAsk || adminQuestion).trim();
    if (!q || askingAdminAI) return;

    setAdminChatHistory((prev) => [...prev, { sender: 'user', text: q }]);
    if (!questionToAsk) setAdminQuestion('');
    setAskingAdminAI(true);

    try {
      const answer = await api.askAdminAI(q);
      setAdminChatHistory((prev) => [...prev, { sender: 'assistant', text: answer }]);
    } catch (err: any) {
      setAdminChatHistory((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Error contacting AI Advisor: ' + err.message },
      ]);
    } finally {
      setAskingAdminAI(false);
    }
  };

  const sampleAdminQuestions = [
    'Summarize the current learning gaps.',
    'Which incident categories need attention?',
    'Explain the phishing simulation results.',
    'What are the most common security topics?',
  ];

  if (loading || !metrics) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs font-mono">
        Aggregating organizational telemetry and security metrics...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
              NETRAK SECURITY COMMAND CENTER
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-semibold">
              ORGANIZATIONAL AWARENESS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-time security telemetry calculated dynamically across employee decisions, simulations, and incidents.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start font-mono text-xs text-slate-400">
          <span>Active Monitored Personnel:</span>
          <span className="text-cyan-400 font-bold">{metrics.totalEmployees}</span>
        </div>
      </div>

      {/* 5 Core Command Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Coverage */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Awareness Coverage</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {metrics.securityAwarenessCoverage}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Across 40 Corporate Policies</span>
        </div>

        {/* Open Incidents */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-900/40 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Open Incidents</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">
            {metrics.openIncidentsCount}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {metrics.incidentSeverityBreakdown.high} High · {metrics.incidentSeverityBreakdown.medium} Med
          </span>
        </div>

        {/* Learning Completion */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Learning Completion</span>
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400 font-mono">
            {metrics.learningCompletionRate}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">20 Micro-Modules Deployed</span>
        </div>

        {/* Quiz Accuracy */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Quiz Accuracy</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {metrics.averageQuizAccuracy}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Average Evaluation Score</span>
        </div>

        {/* Phishing Simulation */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Phish Reporting</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {metrics.simulationMetrics.averageReportRate}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Click Rate: {metrics.simulationMetrics.averageClickRate}%
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Learning Areas */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Awareness Gaps Below Threshold (70%)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Requires Intervention</span>
          </div>

          <div className="space-y-3">
            {metrics.weakLearningTopics.map((w, i) => (
              <div key={i} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 capitalize font-bold">{w.topic}</span>
                  <span className="text-rose-400 font-bold">{w.score}% Accuracy</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${w.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Type Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Incident Category Distribution
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Total: {metrics.totalIncidentsCount} Events</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(metrics.incidentTypeBreakdown).map(([type, count]) => {
              const pct = Math.round((count / metrics.totalIncidentsCount) * 100);
              return (
                <div key={type} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 capitalize">{type.replace('-', ' ')}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{count} incidents</span>
                    <span className="text-cyan-400 font-bold w-10 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin AI Assistant (Grounded In Real Metrics) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-sans">
                Command Center AI Advisor
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Executive insights grounded strictly in organizational telemetry — zero fabricated stats.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            ANALYTICS GROUNDED
          </span>
        </div>

        {/* Chat History */}
        <div className="space-y-3 max-h-60 overflow-y-auto p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          {adminChatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                item.sender === 'user'
                  ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-800/40 ml-8'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 mr-8'
              }`}
            >
              <div className="font-mono text-[10px] uppercase font-bold text-slate-400 mb-1">
                {item.sender === 'user' ? 'Security Manager' : 'NETRAK Executive AI Advisor'}
              </div>
              <div className="whitespace-pre-line">{item.text}</div>
            </div>
          ))}
          {askingAdminAI && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 animate-pulse">
              Synthesizing organizational telemetry into executive briefing...
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase">Sample:</span>
          {sampleAdminQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAskAdmin(q)}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-200 whitespace-nowrap transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAdmin();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={adminQuestion}
            onChange={(e) => setAdminQuestion(e.target.value)}
            placeholder="Ask the executive advisor to interpret gaps, incident trends, or simulation results..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
          <button
            type="submit"
            disabled={!adminQuestion.trim() || askingAdminAI}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consult AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
