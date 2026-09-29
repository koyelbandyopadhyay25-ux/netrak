import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { Lesson, api } from '../services/api.js';

interface MicroLessonModalProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const MicroLessonModal: React.FC<MicroLessonModalProps> = ({
  lesson,
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    policyReference: string;
    updatedTopicScore: number;
    updatedAverageAccuracy: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmitQuiz = async () => {
    if (!selectedOption) return;
    setSubmitting(true);
    try {
      const res = await api.submitQuiz(lesson.id, selectedOption);
      setQuizResult(res);
      if (onCompleted) onCompleted();
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  30-Second Just-In-Time Micro-Lesson
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {lesson.estimatedSeconds}s read
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm mt-0.5">
                {lesson.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {lesson.description}
          </p>

          {/* Key Learning Points */}
          <div className="p-4 bg-slate-950/70 rounded-lg border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Core Security Takeaways:
            </h4>
            <ul className="space-y-1.5 pl-1">
              {lesson.learningPoints.map((point, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge Check */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Quick Knowledge Verification
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                1 question
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
              {lesson.question}
            </p>

            <div className="space-y-2">
              {lesson.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={idx}
                    disabled={Boolean(quizResult)}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    } ${quizResult ? 'cursor-default' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-slate-400 font-semibold shrink-0">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="leading-snug">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Feedback Result */}
          {quizResult && (
            <div
              className={`p-4 rounded-lg border animate-in fade-in duration-200 space-y-2.5 ${
                quizResult.isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {quizResult.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {quizResult.isCorrect ? 'Correct Decision!' : 'Incorrect Choice'}
                </span>
                <span className="ml-auto text-[11px] font-mono text-slate-400">
                  Topic Score: {quizResult.updatedTopicScore}%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {quizResult.explanation}
              </p>
              <div className="text-[11px] font-mono text-cyan-400 pl-7 pt-1">
                Ref: {quizResult.policyReference}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Policy citation: {lesson.policyReference}
          </span>
          <div className="flex gap-2">
            {!quizResult ? (
              <button
                disabled={!selectedOption || submitting}
                onClick={handleSubmitQuiz}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                <span>{submitting ? 'Evaluating...' : 'Confirm Answer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close & Return
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
