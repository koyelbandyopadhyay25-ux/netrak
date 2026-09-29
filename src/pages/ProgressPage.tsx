import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { api, UserProgress, TrainingRecommendation, Lesson } from '../services/api.js';
import { MicroLessonModal } from '../components/MicroLessonModal.js';

export const ProgressPage: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, r] = await Promise.all([api.getProgress(), api.getRecommendations()]);
      setProgress(p);
      setRecommendations(r);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = async (lessonId: string) => {
    try {
      const l = await api.getLesson(lessonId);
      setActiveLesson(l);
    } catch (err) {
      console.error('Error opening lesson:', err);
    }
  };

  if (loading || !progress) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs font-mono">
        Loading personal security learning profile...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
            Security Learning Progress
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your personal security readiness, accuracy rates, and targeted micro-refreshers.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start font-mono text-xs text-slate-400">
          <span>Employee Profile:</span>
          <span className="text-cyan-300 font-bold">{progress.userName}</span>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Overall Readiness</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 font-mono">
            {progress.overallProgress}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress.overallProgress}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {progress.lessonsCompleted} of {progress.totalLessons} micro-modules completed
          </span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Average Quiz Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 font-mono">
            {progress.averageAccuracy}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress.averageAccuracy}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {progress.quizCorrect} correct out of {progress.quizAttempts} evaluations
          </span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Active Refresher Recommendations</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {recommendations.length}
          </div>
          <span className="text-[11px] text-slate-400 block pt-2.5">
            Topics scoring below 70% threshold
          </span>
        </div>
      </div>

      {/* Adaptive Learning Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Flame className="w-4 h-4" />
            <span>Recommended for You (Targeted Skill Boosts)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400 font-bold uppercase">{rec.topic}</span>
                    <span className="text-rose-400 font-semibold">{rec.currentScore}% accuracy</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{rec.suggestedLessonTitle}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rec.reason}</p>
                </div>
                <button
                  onClick={() => handleStartLesson(rec.suggestedLessonId)}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Take 30-Sec Refresher</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic Accuracy Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
          Topic-by-Topic Decision Accuracy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(progress.topicStats).map(([topic, stats]) => {
            const isProficient = stats.score >= 70;
            return (
              <div
                key={topic}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 capitalize">{topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-100">
                      {stats.score}%
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isProficient
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {isProficient ? 'Proficient' : 'Needs Refresher'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isProficient ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${stats.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{stats.correct} of {stats.attempts} correct decisions</span>
                  <span>{stats.lessonsCompleted} module completed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
          Recent Security Awareness Activity
        </h3>
        <div className="space-y-2">
          {progress.history.slice(0, 5).map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-850 text-xs"
            >
              <div className="flex items-center gap-3">
                {h.correct ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-slate-200">{h.question}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Domain: <span className="capitalize">{h.topic}</span> · Selected: "{h.selectedAnswer}"
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {new Date(h.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeLesson && (
        <MicroLessonModal
          lesson={activeLesson}
          isOpen={Boolean(activeLesson)}
          onClose={() => setActiveLesson(null)}
          onCompleted={() => loadData()}
        />
      )}
    </div>
  );
};
