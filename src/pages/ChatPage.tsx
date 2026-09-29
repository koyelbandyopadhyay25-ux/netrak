import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Shield,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { api, AssistantResponse, Lesson } from '../services/api.js';
import { RiskBadge } from '../components/RiskBadge.js';
import { PolicyCitation } from '../components/PolicyCitation.js';
import { IncidentAlert } from '../components/IncidentAlert.js';
import { DemoScenarioSelector } from '../components/DemoScenarioSelector.js';
import { MicroLessonModal } from '../components/MicroLessonModal.js';

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  response?: AssistantResponse;
}

interface ChatPageProps {
  initialQuery?: string;
  onOpenReportModal: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ initialQuery = '', onOpenReportModal }) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am NETRAK, your security awareness copilot. Ask me anything about corporate policies, data sharing, AI tools, emails, passwords, devices, or security incidents before taking action.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoScenarios, setShowDemoScenarios] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || input).trim();
    if (!text || loading) return;

    const userMsg: MessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInput('');
    setLoading(true);

    try {
      const data = await api.sendQuery(text);

      const assistantMsg: MessageItem = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        response: data,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I couldn't process your request right now. Please check that the server is active and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchLesson = async (topic: string) => {
    try {
      const lessons = await api.getLessons();
      const matched =
        lessons.find((l) => l.topic.toLowerCase().includes(topic.toLowerCase())) ||
        lessons[0];
      setActiveLesson(matched);
    } catch (err) {
      console.error('Error launching lesson:', err);
    }
  };

  const samplePrompts = [
    'Can I upload customer data to an AI tool?',
    'Is this password reset email suspicious?',
    'Can I use public Wi-Fi?',
    'Can I share this file externally?',
    'I accidentally exposed an API key.',
    'What should I do if I lost my work laptop?',
    'Can I use my personal USB?',
    'Can I bring my bicycle into the office?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 font-sans">
                NETRAK Security Assistant
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Rules First · Policy Grounded · Selective AI · Zero Hallucination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDemoScenarios(!showDemoScenarios)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
              showDemoScenarios
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showDemoScenarios ? 'Hide Scenarios' : 'Try Demo Scenario'}</span>
          </button>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome-reset',
                  sender: 'assistant',
                  text: "Session refreshed. Ask me anything about your organization's security rules or report an incident.",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Scenario Drawer */}
      {showDemoScenarios && (
        <div className="my-3 shrink-0 animate-in fade-in slide-in-from-top-2 duration-150">
          <DemoScenarioSelector
            onSelect={(prompt) => {
              setShowDemoScenarios(false);
              handleSend(prompt);
            }}
          />
        </div>
      )}

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const r = msg.response;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Shield className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4.5 space-y-3 shadow-lg ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Header label */}
                <div className="flex items-center justify-between gap-4 text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'You' : r?.isIncident ? '🚨 INCIDENT DETECTED' : r?.category === 'UNKNOWN' ? 'ℹ️ POLICY UNAVAILABLE' : '🛡️ NETRAK GUIDANCE'}
                  </span>
                  <div className="flex items-center gap-2">
                    {r && !isUser && <RiskBadge severity={r.severity} />}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Main answer text */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* If Incident Detected */}
                {r?.isIncident && (
                  <IncidentAlert
                    incidentType={r.incidentType}
                    severity={r.severity}
                    riskIndicators={r.riskIndicators}
                    recommendedAction={r.recommendedAction}
                    onReportClick={onOpenReportModal}
                  />
                )}

                {/* Structured Guidance for Policy Questions */}
                {r && !r.isIncident && r.category !== 'UNKNOWN' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                    {/* Recommended Action */}
                    {r.recommendedAction && (
                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Recommended Action:
                        </span>
                        <p className="text-slate-300 leading-snug">{r.recommendedAction}</p>
                      </div>
                    )}

                    {/* Policy Citations */}
                    {r.policyReferences && r.policyReferences.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                          Verified Policy Source:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {r.policyReferences.map((ref, i) => (
                            <PolicyCitation key={i} reference={ref} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Lesson Action */}
                    {r.trainingRecommended && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-cyan-400" />
                          <span className="text-[11px] text-slate-300">
                            Recommended 30-sec refresher on{' '}
                            <span className="font-semibold text-cyan-300 capitalize">{r.trainingTopic}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => handleLaunchLesson(r.trainingTopic)}
                          className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Learn (30s)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-cyan-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start text-sm animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none space-y-2 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="animate-spin">•</span>
                <span>Retrieving policies & evaluating deterministic risk...</span>
              </div>
              <div className="h-2 bg-slate-800 rounded w-48" />
              <div className="h-2 bg-slate-800 rounded w-32" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase tracking-wider">
          Suggested:
        </span>
        {samplePrompts.slice(0, 5).map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-200 whitespace-nowrap transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all shadow-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about corporate policies, AI tools, emails, passwords, Wi-Fi, or incidents..."
            className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="m-1.5 p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white transition-all cursor-pointer shadow-md shadow-cyan-950/50"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Micro-Lesson Modal */}
      {activeLesson && (
        <MicroLessonModal
          lesson={activeLesson}
          isOpen={Boolean(activeLesson)}
          onClose={() => setActiveLesson(null)}
        />
      )}
    </div>
  );
};
