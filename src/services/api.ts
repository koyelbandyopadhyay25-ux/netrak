export interface AssistantResponse {
  answer: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  isIncident: boolean;
  incidentType: string;
  riskIndicators: string[];
  recommendedAction: string;
  policyReferences: Array<{
    id: string;
    section: string;
    title: string;
  }>;
  trainingRecommended: boolean;
  trainingTopic: string;
  confidence: number;
}

export interface Policy {
  id: string;
  topic: string;
  title: string;
  section: string;
  rule: string;
  explanation: string;
  keywords: string[];
}

export interface Lesson {
  id: string;
  topic: string;
  title: string;
  estimatedSeconds: number;
  description: string;
  learningPoints: string[];
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  policyReference: string;
}

export interface Scenario {
  id: string;
  topic: string;
  title: string;
  context: string;
  dilemma: string;
  choices: Array<{
    id: string;
    text: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    isCorrect: boolean;
    feedback: string;
    policyCitation: string;
  }>;
}

export interface UserProgress {
  userId: string;
  userName: string;
  overallProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  scenariosAttempted: number;
  quizAttempts: number;
  quizCorrect: number;
  averageAccuracy: number;
  topicStats: Record<
    string,
    {
      attempts: number;
      correct: number;
      score: number;
      lessonsCompleted: number;
      status: 'proficient' | 'needs_refresher';
    }
  >;
  history: Array<{
    type: string;
    topic: string;
    question: string;
    selectedAnswer: string;
    correct: boolean;
    timestamp: string;
  }>;
}

export interface TrainingRecommendation {
  topic: string;
  currentScore: number;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  suggestedLessonId: string;
  suggestedLessonTitle: string;
}

export interface Incident {
  id: string;
  reporter: string;
  email: string;
  department: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  createdAt: string;
  title: string;
  description: string;
  affectedAssets: string[];
  immediateActions: string;
  assignedTo?: string;
  resolvedAt?: string;
}

export interface DashboardMetrics {
  totalEmployees: number;
  securityAwarenessCoverage: number;
  openIncidentsCount: number;
  totalIncidentsCount: number;
  incidentSeverityBreakdown: { high: number; medium: number; low: number };
  incidentTypeBreakdown: Record<string, number>;
  averageQuizAccuracy: number;
  learningCompletionRate: number;
  simulationMetrics: {
    totalCampaigns: number;
    totalSimulated: number;
    totalViewed: number;
    totalClicked: number;
    totalReported: number;
    averageClickRate: number;
    averageReportRate: number;
  };
  weakLearningTopics: Array<{ topic: string; score: number; status: string }>;
  policyCoverageCount: number;
}

export interface PhishingCampaign {
  id: string;
  name: string;
  difficulty: 'low' | 'medium' | 'high';
  scenario: string;
  targetGroup: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT';
  sender: string;
  subject: string;
  previewText: string;
  body: string;
  ctaText: string;
  objective: string;
  metrics: {
    simulated: number;
    viewed: number;
    clicked: number;
    reported: number;
    ignored: number;
  };
  redFlags: string[];
}

export const api = {
  // Chat
  async sendQuery(question: string): Promise<AssistantResponse> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Failed to get security guidance');
    return res.json();
  },

  // Policies
  async getPolicies(): Promise<Policy[]> {
    const res = await fetch('/api/policies');
    if (!res.ok) throw new Error('Failed to load policies');
    return res.json();
  },

  async searchPolicies(query: string): Promise<{ found: boolean; results: Policy[]; score: number }> {
    const res = await fetch('/api/policies/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // Training
  async getLessons(): Promise<Lesson[]> {
    const res = await fetch('/api/training/lessons');
    if (!res.ok) throw new Error('Failed to load lessons');
    return res.json();
  },

  async getLesson(id: string): Promise<Lesson> {
    const res = await fetch(`/api/training/lessons/${id}`);
    if (!res.ok) throw new Error('Lesson not found');
    return res.json();
  },

  async getScenarios(): Promise<Scenario[]> {
    const res = await fetch('/api/training/scenarios');
    if (!res.ok) throw new Error('Failed to load scenarios');
    return res.json();
  },

  async submitQuiz(lessonId: string, selectedAnswer: string): Promise<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    policyReference: string;
    updatedTopicScore: number;
    updatedAverageAccuracy: number;
  }> {
    const res = await fetch('/api/training/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, selectedAnswer }),
    });
    if (!res.ok) throw new Error('Quiz evaluation failed');
    return res.json();
  },

  async getProgress(): Promise<UserProgress> {
    const res = await fetch('/api/training/progress');
    if (!res.ok) throw new Error('Failed to load progress');
    return res.json();
  },

  async getRecommendations(): Promise<TrainingRecommendation[]> {
    const res = await fetch('/api/training/recommendations');
    if (!res.ok) throw new Error('Failed to load recommendations');
    return res.json();
  },

  // Incidents
  async getIncidents(filters?: { status?: string; severity?: string; type?: string }): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.type) params.append('type', filters.type);
    const res = await fetch(`/api/incidents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load incidents');
    return res.json();
  },

  async createIncident(payload: Partial<Incident>): Promise<Incident> {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create incident report');
    return res.json();
  },

  async updateIncidentStatus(id: string, status: string, assignedTo?: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignedTo }),
    });
    if (!res.ok) throw new Error('Failed to update incident status');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<DashboardMetrics> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  async askAdminAI(question: string): Promise<string> {
    const res = await fetch('/api/analytics/admin-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Admin AI request failed');
    const data = await res.json();
    return data.answer;
  },

  // Phishing Simulator
  async getCampaigns(): Promise<PhishingCampaign[]> {
    const res = await fetch('/api/phishing/campaigns');
    if (!res.ok) throw new Error('Failed to load phishing campaigns');
    return res.json();
  },

  async simulatePhishingAction(campaignId: string, action: 'open' | 'report' | 'ignore' | 'click') {
    const res = await fetch('/api/phishing/simulate-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, action }),
    });
    if (!res.ok) throw new Error('Action simulation failed');
    return res.json();
  },
};
