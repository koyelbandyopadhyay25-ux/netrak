import React, { useEffect, useState } from 'react';
import {
  MessageSquareCode,
  AlertOctagon,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Clock,
  Flame,
} from 'lucide-react';
import { api, UserProgress, TrainingRecommendation, Lesson } from '../services/api.js';
import { MicroLessonModal } from '../components/MicroLessonModal.js';

interface DashboardProps {
  onNavigate: (tab: string, initialQuery?: string) => void;
  onOpenReportModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenReportModal }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const quickTopics = [
    { label: 'AI Security', query: 'Can I paste company documents into an AI tool like ChatGPT?' },
    { label: 'Phishing', query: 'I received an urgent email asking for an immediate password update.' },
    { label: 'Data Sharing', query: 'Can I upload our client database to my personal Google Drive?' },
    { label: 'Passwords & MFA', query: 'Why did I receive an unexpected MFA push notification?' },
    { label: 'Public Wi-Fi', query: 'Is it safe to work from airport or hotel Wi-Fi?' },
    { label: 'USB & Media', query: 'Can I plug my personal USB flash drive into my work laptop?' },
    { label: 'Lost Device', query: 'What should I do if I lost my corporate laptop?' },
    { label: 'Source Code', query: 'Can I make an internal GitHub repository public?' },
  ];

  const loadData = async () => {
    try {
      const [prog, recs] = await Promise.all([
        api.getProgress(),
        api.getRecommendations(),
      ]);
      setProgress(prog);
      setRecommendations(recs);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartRecommendation = async (rec: TrainingRecommendation) => {
    try {
      const lesson = await api.getLesson(rec.suggestedLessonId);
      setActiveLesson(lesson);
    } catch (err) {
      console.error('Error starting lesson:', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>NETRAK Enterprise Security Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
            What do you need help with today?
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Get instant, policy-grounded guidance before making security decisions.
            Ask about files, AI tools, accounts, suspicious emails, or report an incident.
          </p>
        </div>
      </div>

      {/* 4 Core Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ask Security Copilot */}
        <button
          onClick={() => onNavigate('chat')}
          className="text-left p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
              Ask NETRAK Copilot
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Verify if an action is allowed under current corporate policy.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-4 font-semibold">
            <span>Consult Assistant</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Report Incident */}
        <button
          onClick={onOpenReportModal}
          className="text-left p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-850/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
              Report an Incident
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Clicked a link? Lost a device? Trigger immediate SOC containment.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 mt-4 font-semibold">
            <span>Escalate to SOC</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Just-In-Time Learning */}
        <button
          onClick={() => onNavigate('training')}
          className="text-left p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
              Just-in-Time Learning
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              20 bite-sized 30-second security micro-lessons with quizzes.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 mt-4 font-semibold">
            <span>Explore 20 Lessons</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 4: Phishing Simulator */}
        <button
          onClick={() => onNavigate('phishing-simulator')}
          className="text-left p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
              Phishing Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Practice spotting realistic email lures in a safe sandbox.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mt-4 font-semibold">
            <span>Test Your Eye</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Quick Security Topics Buttons */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Frequently Asked Security Scenarios
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => onNavigate('chat', topic.query)}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-300 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{topic.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Learning "Recommended for You" */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Recommended for You (Adaptive Learning)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Based on your quiz attempts
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="uppercase text-amber-300 font-bold tracking-wider">
                      🎯 {rec.topic} Refresher
                    </span>
                    <span className="text-rose-400 font-semibold">
                      Current Score: {rec.currentScore}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {rec.suggestedLessonTitle}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
                <button
                  onClick={() => handleStartRecommendation(rec)}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Start 30-Second Refresher</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 text-center">
            Great job! All your quiz scores are above the 70% threshold.
          </div>
        )}
      </div>

      {/* MicroLesson Modal */}
      {activeLesson && (
        <MicroLessonModal
          lesson={activeLesson}
          isOpen={Boolean(activeLesson)}
          onClose={() => setActiveLesson(null)}
          onCompleted={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
