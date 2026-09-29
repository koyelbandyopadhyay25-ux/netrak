import { incidentService } from './incidentService.js';
import { trainingEngine } from './trainingEngine.js';
import phishingData from '../data/phishingCampaigns.json' with { type: 'json' };
import usersData from '../data/users.json' with { type: 'json' };
import policiesData from '../data/policies.json' with { type: 'json' };
import { GoogleGenAI } from '@google/genai';

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

export function computeAnalytics(): DashboardMetrics {
  const incidents = incidentService.getAll();
  const openIncidents = incidents.filter((i) => i.status === 'OPEN' || i.status === 'UNDER_REVIEW');

  const severityCounts = { high: 0, medium: 0, low: 0 };
  const typeCounts: Record<string, number> = {};

  for (const inc of incidents) {
    if (inc.severity === 'high') severityCounts.high += 1;
    else if (inc.severity === 'medium') severityCounts.medium += 1;
    else severityCounts.low += 1;

    typeCounts[inc.type] = (typeCounts[inc.type] || 0) + 1;
  }

  const progress = trainingEngine.getProgress();
  const weakTopics = Object.entries(progress.topicStats)
    .filter(([_, stats]) => stats.score < 70)
    .map(([topic, stats]) => ({
      topic,
      score: stats.score,
      status: stats.status,
    }))
    .sort((a, b) => a.score - b.score);

  // Phishing simulation metrics
  let totalSimulated = 0;
  let totalViewed = 0;
  let totalClicked = 0;
  let totalReported = 0;

  for (const camp of phishingData as any[]) {
    totalSimulated += camp.metrics.simulated;
    totalViewed += camp.metrics.viewed;
    totalClicked += camp.metrics.clicked;
    totalReported += camp.metrics.reported;
  }

  const avgClickRate = totalSimulated > 0 ? Math.round((totalClicked / totalSimulated) * 100) : 0;
  const avgReportRate = totalSimulated > 0 ? Math.round((totalReported / totalSimulated) * 100) : 0;

  const users = usersData as any[];
  const avgUserScore = Math.round(users.reduce((acc, u) => acc + u.awarenessScore, 0) / users.length);

  return {
    totalEmployees: users.length,
    securityAwarenessCoverage: avgUserScore,
    openIncidentsCount: openIncidents.length,
    totalIncidentsCount: incidents.length,
    incidentSeverityBreakdown: severityCounts,
    incidentTypeBreakdown: typeCounts,
    averageQuizAccuracy: progress.averageAccuracy,
    learningCompletionRate: progress.overallProgress,
    simulationMetrics: {
      totalCampaigns: phishingData.length,
      totalSimulated,
      totalViewed,
      totalClicked,
      totalReported,
      averageClickRate: avgClickRate,
      averageReportRate: avgReportRate,
    },
    weakLearningTopics: weakTopics,
    policyCoverageCount: policiesData.length,
  };
}

export async function askAdminAssistant(question: string): Promise<string> {
  const metrics = computeAnalytics();
  const contextStr = `
ACTUAL ORGANIZATION ANALYTICS DATA (Grounding Source):
- Total Employees: ${metrics.totalEmployees}
- Security Awareness Coverage: ${metrics.securityAwarenessCoverage}%
- Total Policies Active: ${metrics.policyCoverageCount}
- Open/Under-Review Incidents: ${metrics.openIncidentsCount} (High Severity: ${metrics.incidentSeverityBreakdown.high}, Medium: ${metrics.incidentSeverityBreakdown.medium})
- Incident Categories: ${Object.entries(metrics.incidentTypeBreakdown).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Organization Quiz Accuracy: ${metrics.averageQuizAccuracy}%
- Learning Path Completion: ${metrics.learningCompletionRate}%
- Phishing Simulation Statistics:
  * Total Drills Simulated: ${metrics.simulationMetrics.totalSimulated}
  * Reported by Employees: ${metrics.simulationMetrics.totalReported} (${metrics.simulationMetrics.averageReportRate}% report rate)
  * Clicked by Employees: ${metrics.simulationMetrics.totalClicked} (${metrics.simulationMetrics.averageClickRate}% click rate)
- Weak Learning Areas Below Threshold (70%):
  ${metrics.weakLearningTopics.map((w) => `* ${w.topic}: ${w.score}% accuracy`).join('\n  ')}
`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the NETRAK Command Center Executive AI Advisor.
Your job is to assist CISOs and security managers by interpreting the organization's real metrics.

RULES:
- Base your analysis STRICTLY on the actual numbers provided in the context below.
- Do NOT invent or alter any statistics, percentages, or incident counts.
- Provide crisp, executive-grade analysis with clear tactical recommendations.

${contextStr}

ADMIN QUESTION: "${question}"`,
      });

      if (response.text) return response.text.trim();
    } catch (err) {
      console.warn('[Admin AI Assistant fallback]:', err);
    }
  }

  // Deterministic analysis fallback
  const qLower = question.toLowerCase();
  if (qLower.includes('gap') || qLower.includes('weak') || qLower.includes('attention')) {
    const gaps = metrics.weakLearningTopics.map((t) => `${t.topic} (${t.score}%)`).join(', ');
    return `Based on live metrics across ${metrics.totalEmployees} personnel, primary awareness gaps are concentrated in: ${gaps}. While overall coverage is ${metrics.securityAwarenessCoverage}%, phishing vulnerability remains the top exposure vector with a ${metrics.simulationMetrics.averageClickRate}% simulation click rate. We recommend scheduling targeted 30-second refreshers in Phishing and AI Security.`;
  }

  if (qLower.includes('incident') || qLower.includes('trend')) {
    return `The SOC currently tracks ${metrics.openIncidentsCount} active incidents (${metrics.incidentSeverityBreakdown.high} high severity). The leading incident types are credential exposure and phishing clicks. Immediate priorities include enforcing stricter MFA push protections and auditing public repository secret leaks.`;
  }

  if (qLower.includes('phishing') || qLower.includes('simulation')) {
    return `Across ${metrics.simulationMetrics.totalCampaigns} simulation campaigns (${metrics.simulationMetrics.totalSimulated} drills dispatched), employee reporting stands strong at ${metrics.simulationMetrics.averageReportRate}% (${metrics.simulationMetrics.totalReported} flagged), while the click-through rate is held at ${metrics.simulationMetrics.averageClickRate}%. Executive impersonation and credential update lures generated the highest interaction rates.`;
  }

  return `Executive Summary: NETRAK platform monitors ${metrics.totalEmployees} employees across ${metrics.policyCoverageCount} corporate policies. Overall awareness coverage is ${metrics.securityAwarenessCoverage}%, quiz accuracy is ${metrics.averageQuizAccuracy}%, and ${metrics.openIncidentsCount} incidents are undergoing SOC remediation. Weakest learning areas are ${metrics.weakLearningTopics.map((t) => t.topic).join(', ')}.`;
}
