import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { api, Lesson, Scenario } from '../services/api.js';
import { MicroLessonModal } from '../components/MicroLessonModal.js';
import { RiskBadge } from '../components/RiskBadge.js';

export const TrainingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'lessons' | 'scenarios'>('lessons');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [l, s] = await Promise.all([api.getLessons(), api.getScenarios()]);
      setLessons(l);
      setScenarios(s);
    } catch (err) {
      console.error('Error loading training content:', err);
    } finally {
      setLoading(false);
    }
  };

  const topics = [
    'all',
    'phishing',
    'AI security',
    'password security',
    'data sharing',
    'MFA',
    'public Wi-Fi',
    'remote work',
    'USB',
    'incident response',
    'source code security',
    'physical security',
  ];

  const filteredLessons = lessons.filter((l) =>
    selectedTopic === 'all' ? true : l.topic.toLowerCase().includes(selectedTopic.toLowerCase())
  );

  const filteredScenarios = scenarios.filter((s) =>
    selectedTopic === 'all' ? true : s.topic.toLowerCase().includes(selectedTopic.toLowerCase())
  );

  const handleSelectScenarioChoice = (scenarioId: string, choiceId: string) => {
    setScenarioAnswers((prev) => ({ ...prev, [scenarioId]: choiceId }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
              Just-in-Time Learning
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-semibold">
              30-SEC MICRO-DRILLS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Short, focused security awareness scenarios grounded in corporate policies.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start">
          <button
            onClick={() => setViewMode('lessons')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'lessons'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Micro-Lessons ({lessons.length})
          </button>
          <button
            onClick={() => setViewMode('scenarios')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'scenarios'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decision Scenarios ({scenarios.length})
          </button>
        </div>
      </div>

      {/* Topic Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all cursor-pointer border ${
              selectedTopic === t
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {t === 'all' ? 'All Domains' : t}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-mono">
          Loading learning modules...
        </div>
      ) : viewMode === 'lessons' ? (
        /* Lessons Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850/80 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-semibold uppercase">{lesson.topic}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {lesson.estimatedSeconds}s
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {lesson.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  Ref: {lesson.policyReference}
                </div>
                <button
                  onClick={() => setActiveLesson(lesson)}
                  className="w-full py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Start 30-Sec Drill</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Scenarios Grid */
        <div className="space-y-5">
          {filteredScenarios.map((scenario) => {
            const selectedChoiceId = scenarioAnswers[scenario.id];
            const selectedChoice = scenario.choices.find((c) => c.id === selectedChoiceId);

            return (
              <div
                key={scenario.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 uppercase font-semibold">
                      {scenario.topic}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{scenario.id}</span>
                  </div>
                  {selectedChoice && <RiskBadge severity={selectedChoice.risk.toLowerCase() as any} />}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-100">{scenario.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{scenario.context}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-200">
                  <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    Decision Dilemma:
                  </span>
                  {scenario.dilemma}
                </div>

                {/* Choices */}
                <div className="space-y-2">
                  {scenario.choices.map((choice) => {
                    const isSelected = selectedChoiceId === choice.id;
                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleSelectScenarioChoice(scenario.id, choice.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/50'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-mono text-cyan-400 font-bold shrink-0">
                            [{choice.risk}]
                          </span>
                          <span className="leading-snug">{choice.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback if answered */}
                {selectedChoice && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                      selectedChoice.isCorrect
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedChoice.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="font-bold uppercase tracking-wider">
                          {selectedChoice.isCorrect ? 'Approved Safe Path' : 'Dangerous Decision'}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-cyan-400">
                        Citation: {selectedChoice.policyCitation}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-6">{selectedChoice.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Micro-Lesson Modal */}
      {activeLesson && (
        <MicroLessonModal
          lesson={activeLesson}
          isOpen={Boolean(activeLesson)}
          onClose={() => setActiveLesson(null)}
          onCompleted={() => loadContent()}
        />
      )}
    </div>
  );
};
