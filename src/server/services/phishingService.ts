import phishingData from '../data/phishingCampaigns.json' with { type: 'json' };

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

class PhishingStore {
  private campaigns: PhishingCampaign[] = JSON.parse(JSON.stringify(phishingData));

  public getAll(): PhishingCampaign[] {
    return this.campaigns;
  }

  public getById(id: string): PhishingCampaign | undefined {
    return this.campaigns.find((c) => c.id === id);
  }

  public createCampaign(payload: Partial<PhishingCampaign>): PhishingCampaign {
    const newId = `SIM-2026-${Math.floor(10 + Math.random() * 90)}`;
    const newCampaign: PhishingCampaign = {
      id: newId,
      name: payload.name || 'New Security Awareness Drill',
      difficulty: payload.difficulty || 'medium',
      scenario: payload.scenario || 'Synthetic Email Verification Drill',
      targetGroup: payload.targetGroup || 'All Staff',
      status: 'ACTIVE',
      sender: payload.sender || 'Security Awareness Team <drill@netrak-sim.internal>',
      subject: payload.subject || 'Action Required: Verify Account Access',
      previewText: payload.previewText || 'Please verify your session credentials...',
      body: payload.body || 'This is a scheduled simulated security awareness drill designed to reinforce phishing detection.',
      ctaText: payload.ctaText || 'Review Verification Details',
      objective: payload.objective || 'Measure staff click rates and immediate reporting speed.',
      metrics: {
        simulated: 150,
        viewed: 0,
        clicked: 0,
        reported: 0,
        ignored: 0,
      },
      redFlags: payload.redFlags || ['Unverified sender domain', 'Urgent call to action'],
    };

    this.campaigns.unshift(newCampaign);
    return newCampaign;
  }

  public recordAction(campaignId: string, action: 'open' | 'report' | 'ignore' | 'click'): {
    success: boolean;
    feedback: string;
    isSafe: boolean;
    redFlags: string[];
    updatedMetrics: PhishingCampaign['metrics'];
  } {
    const campaign = this.getById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    if (action === 'open') {
      campaign.metrics.viewed += 1;
      return {
        success: true,
        feedback: 'Email opened for preview. Inspect headers and sender domain carefully.',
        isSafe: true,
        redFlags: campaign.redFlags,
        updatedMetrics: campaign.metrics,
      };
    } else if (action === 'report') {
      campaign.metrics.reported += 1;
      return {
        success: true,
        feedback: 'Outstanding! You correctly identified the phishing simulation drill and reported it to Security.',
        isSafe: true,
        redFlags: campaign.redFlags,
        updatedMetrics: campaign.metrics,
      };
    } else if (action === 'click') {
      campaign.metrics.clicked += 1;
      return {
        success: true,
        feedback: 'Warning: You clicked a simulated phishing link! In a real scenario, this would have exposed your credentials or installed malware.',
        isSafe: false,
        redFlags: campaign.redFlags,
        updatedMetrics: campaign.metrics,
      };
    } else {
      campaign.metrics.ignored += 1;
      return {
        success: true,
        feedback: 'Email ignored. While safer than clicking, proactive reporting is always preferred to protect coworkers.',
        isSafe: true,
        redFlags: campaign.redFlags,
        updatedMetrics: campaign.metrics,
      };
    }
  }
}

export const phishingService = new PhishingStore();
