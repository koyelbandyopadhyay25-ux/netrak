import React, { useState } from 'react';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { Landing } from './pages/Landing.js';
import { Dashboard } from './pages/Dashboard.js';
import { ChatPage } from './pages/ChatPage.js';
import { TrainingPage } from './pages/TrainingPage.js';
import { ProgressPage } from './pages/ProgressPage.js';
import { IncidentPage } from './pages/IncidentPage.js';
import { IncidentManagement } from './pages/IncidentManagement.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { PolicyManagement } from './pages/PolicyManagement.js';
import { PhishingSimulator } from './pages/PhishingSimulator.js';
import { IncidentReportForm } from './components/IncidentReportForm.js';
import { DemoScenarioSelector } from './components/DemoScenarioSelector.js';
import { X, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  const handleNavigate = (tab: string, query?: string) => {
    if (query) {
      setChatInitialQuery(query);
      setCurrentTab('chat');
    } else {
      setCurrentTab(tab);
    }
  };

  const handleSelectDemoPrompt = (prompt: string) => {
    setIsDemoModalOpen(false);
    setChatInitialQuery(prompt);
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenDemoScenarios={() => setIsDemoModalOpen(true)}
        onOpenIncidentModal={() => setIsReportModalOpen(true)}
      />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'incident-report') {
              setIsReportModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentTab === 'landing' && (
            <Landing
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenDemoScenarios={() => setIsDemoModalOpen(true)}
            />
          )}

          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}

          {currentTab === 'chat' && (
            <ChatPage
              initialQuery={chatInitialQuery}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}

          {currentTab === 'training' && <TrainingPage />}

          {currentTab === 'progress' && <ProgressPage />}

          {currentTab === 'incident-report' && <IncidentPage />}

          {currentTab === 'phishing-simulator' && <PhishingSimulator />}

          {currentTab === 'admin-dashboard' && <AdminDashboard />}

          {currentTab === 'incident-management' && <IncidentManagement />}

          {currentTab === 'policy-management' && <PolicyManagement />}
        </main>
      </div>

      {/* Global Incident Report Modal */}
      <IncidentReportForm
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitted={() => {
          // If on admin incident management, it auto-syncs on reload
        }}
      />

      {/* Global Demo Scenario Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-mono">
                  NETRAK 1-Click Demo Scenarios (Judge Walkthrough)
                </h3>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Click any scenario below to immediately trigger the corresponding decision journey,
              policy retrieval, risk analysis, and educational response:
            </p>

            <DemoScenarioSelector onSelect={handleSelectDemoPrompt} />
          </div>
        </div>
      )}
    </div>
  );
}
