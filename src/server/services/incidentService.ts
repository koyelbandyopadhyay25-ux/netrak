import incidentsData from '../data/incidents.json' with { type: 'json' };
import auditLogData from '../data/auditLog.json' with { type: 'json' };

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

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  details: string;
}

class IncidentStore {
  private incidents: Incident[] = [...(incidentsData as Incident[])];
  private auditLogs: AuditEntry[] = [...(auditLogData as AuditEntry[])];

  public getAll(filters?: { status?: string; severity?: string; type?: string }): Incident[] {
    return this.incidents.filter((inc) => {
      if (filters?.status && filters.status !== 'all' && inc.status !== filters.status) return false;
      if (filters?.severity && filters.severity !== 'all' && inc.severity !== filters.severity) return false;
      if (filters?.type && filters.type !== 'all' && inc.type !== filters.type) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): Incident | undefined {
    return this.incidents.find((inc) => inc.id === id);
  }

  public create(payload: Partial<Incident>): Incident {
    const newId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const incident: Incident = {
      id: newId,
      reporter: payload.reporter || 'Demo Employee',
      email: payload.email || 'employee@corp.netrak.internal',
      department: payload.department || 'Operations',
      type: payload.type || 'other',
      severity: payload.severity || 'high',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      title: payload.title || 'Reported Security Concern',
      description: payload.description || 'Employee flagged a security incident.',
      affectedAssets: payload.affectedAssets || ['Workstation'],
      immediateActions: payload.immediateActions || 'Incident registered for SOC review.',
      assignedTo: 'SOC Incident Commander (Tier 1)',
    };

    this.incidents.unshift(incident);

    // Audit log
    this.addAudit({
      action: 'INCIDENT_CREATED',
      userId: incident.email,
      details: `Incident ${incident.id} created: ${incident.title} (${incident.type}, ${incident.severity})`,
    });

    return incident;
  }

  public updateStatus(id: string, status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED', assignedTo?: string): Incident | null {
    const inc = this.incidents.find((i) => i.id === id);
    if (!inc) return null;

    const oldStatus = inc.status;
    inc.status = status;
    if (assignedTo) inc.assignedTo = assignedTo;
    if (status === 'RESOLVED') inc.resolvedAt = new Date().toISOString();

    this.addAudit({
      action: 'INCIDENT_STATUS_UPDATED',
      userId: 'admin@corp.netrak.internal',
      details: `Incident ${id} status changed from ${oldStatus} to ${status}`,
    });

    return inc;
  }

  public getAuditLogs(): AuditEntry[] {
    return this.auditLogs.slice(0, 50);
  }

  public addAudit(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
    const audit: AuditEntry = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(audit);
  }
}

export const incidentService = new IncidentStore();
