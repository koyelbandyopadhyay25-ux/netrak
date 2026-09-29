import { Router, Request, Response } from 'express';
import policiesData from '../data/policies.json' with { type: 'json' };
import { searchPolicy } from '../services/policySearch.js';
import { processSecurityQuery } from '../services/gemini.js';
import { incidentService } from '../services/incidentService.js';
import { trainingEngine } from '../services/trainingEngine.js';
import { computeAnalytics, askAdminAssistant } from '../services/analyticsEngine.js';
import { phishingService } from '../services/phishingService.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    application: 'NETRAK',
    version: '1.0.0',
    mode: 'enterprise-security-copilot',
  });
});

// Chat endpoint (Grounded Decision Engine)
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question string is required' });
      return;
    }
    const result = await processSecurityQuery(question);
    res.json(result);
  } catch (err: any) {
    console.error('Error processing /api/chat:', err);
    res.status(500).json({
      error: 'Unable to process security query at this time. Please retry.',
      details: err?.message,
    });
  }
});

// Policies
apiRouter.get('/policies', (_req: Request, res: Response) => {
  res.json(policiesData);
});

apiRouter.post('/policies/search', (req: Request, res: Response) => {
  const { query, minScore } = req.body;
  const result = searchPolicy(query || '', minScore || 15);
  res.json(result);
});

// Training - Lessons & Topics
apiRouter.get('/training/lessons', (_req: Request, res: Response) => {
  res.json(trainingEngine.getLessons());
});

apiRouter.get('/training/lessons/:id', (req: Request, res: Response) => {
  const lesson = trainingEngine.getLessonById(req.params.id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json(lesson);
});

apiRouter.get('/training/topic/:topic', (req: Request, res: Response) => {
  const lessons = trainingEngine.getLessonsByTopic(req.params.topic);
  res.json(lessons);
});

// Training - Scenarios
apiRouter.get('/training/scenarios', (_req: Request, res: Response) => {
  res.json(trainingEngine.getScenarios());
});

apiRouter.get('/training/scenarios/:id', (req: Request, res: Response) => {
  const scenario = trainingEngine.getScenarioById(req.params.id);
  if (!scenario) {
    res.status(404).json({ error: 'Scenario not found' });
    return;
  }
  res.json(scenario);
});

// Training - Quiz Scoring (Deterministic)
apiRouter.post('/training/quiz', (req: Request, res: Response) => {
  try {
    const { lessonId, selectedAnswer } = req.body;
    if (!lessonId || selectedAnswer === undefined) {
      res.status(400).json({ error: 'lessonId and selectedAnswer are required' });
      return;
    }
    const result = trainingEngine.submitQuizAnswer(lessonId, selectedAnswer);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Training - Progress & Adaptive Recommendations
apiRouter.get('/training/progress', (_req: Request, res: Response) => {
  res.json(trainingEngine.getProgress());
});

apiRouter.get('/training/recommendations', (_req: Request, res: Response) => {
  res.json(trainingEngine.getRecommendations());
});

// Incidents
apiRouter.get('/incidents', (req: Request, res: Response) => {
  const { status, severity, type } = req.query as Record<string, string>;
  const incidents = incidentService.getAll({ status, severity, type });
  res.json(incidents);
});

apiRouter.get('/incidents/:id', (req: Request, res: Response) => {
  const incident = incidentService.getById(req.params.id);
  if (!incident) {
    res.status(404).json({ error: 'Incident not found' });
    return;
  }
  res.json(incident);
});

apiRouter.post('/incidents', (req: Request, res: Response) => {
  try {
    const created = incidentService.create(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.patch('/incidents/:id/status', (req: Request, res: Response) => {
  const { status, assignedTo } = req.body;
  if (!['OPEN', 'UNDER_REVIEW', 'RESOLVED'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be OPEN, UNDER_REVIEW, or RESOLVED' });
    return;
  }
  const updated = incidentService.updateStatus(req.params.id, status, assignedTo);
  if (!updated) {
    res.status(404).json({ error: 'Incident not found' });
    return;
  }
  res.json(updated);
});

// Audit Logs
apiRouter.get('/audit-logs', (_req: Request, res: Response) => {
  res.json(incidentService.getAuditLogs());
});

// Analytics & Command Center
apiRouter.get('/analytics', (_req: Request, res: Response) => {
  const metrics = computeAnalytics();
  res.json(metrics);
});

apiRouter.post('/analytics/admin-chat', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Question required' });
      return;
    }
    const answer = await askAdminAssistant(question);
    res.json({ answer });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process admin query', details: err?.message });
  }
});

// Phishing Simulation
apiRouter.get('/phishing/campaigns', (_req: Request, res: Response) => {
  res.json(phishingService.getAll());
});

apiRouter.post('/phishing/campaigns', (req: Request, res: Response) => {
  const created = phishingService.createCampaign(req.body);
  res.status(201).json(created);
});

apiRouter.get('/phishing/campaigns/:id', (req: Request, res: Response) => {
  const campaign = phishingService.getById(req.params.id);
  if (!campaign) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }
  res.json(campaign);
});

apiRouter.get('/phishing/campaigns/:id/results', (req: Request, res: Response) => {
  const campaign = phishingService.getById(req.params.id);
  if (!campaign) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }
  res.json({
    id: campaign.id,
    name: campaign.name,
    metrics: campaign.metrics,
    redFlags: campaign.redFlags,
  });
});

apiRouter.post('/phishing/simulate-action', (req: Request, res: Response) => {
  const { campaignId, action } = req.body;
  if (!campaignId || !action) {
    res.status(400).json({ error: 'campaignId and action required' });
    return;
  }
  try {
    const result = phishingService.recordAction(campaignId, action);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
