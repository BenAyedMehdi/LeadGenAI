export type RoleType = 'Decision maker' | 'Technical contact';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type LeadStatus = 'NEW' | 'APPROVED' | 'REJECTED';
export type CriterionRating = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Offering {
  id: string;
  name: string;
  description: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface SearchTarget {
  offering: string;
  organization: string;
  country: string;
  targetRoles: string[];
}

export interface SearchCounts {
  locations: number;
  orgUnits: number;
  contacts: number;
  leads: number;
}

export interface OrgUnitNode {
  name: string;
  contactCount: number;
}

export interface LocationNode {
  name: string;
  orgUnits: OrgUnitNode[];
}

export interface CountryNode {
  name: string;
  locations: LocationNode[];
}

export interface SignalSource {
  name: string;
  lastUpdated: string; // ISO date format YYYY-MM-DD
  isMock: boolean;
}

export interface Signal {
  id: string;
  fact: string;
  hypothesis: string;
  serviceMatch: string;
  openQuestion: string;
  source?: SignalSource | null;
}

export interface ScoreCriterion {
  criterion: string;
  rating: CriterionRating;
  points: number;
  maxPoints: number;
  reason: string;
}

export interface OutreachDraft {
  subject: string;
  body: string;
  generatedBy: string;
  lastSavedAt?: string;
}

export interface LeadSummary {
  rank: number;
  id: string;
  name: string;
  title: string;
  roleType: RoleType;
  orgUnit: string;
  city: string;
  score: number;
  scoreLabel: string;
  confidence: ConfidenceLevel;
  status: LeadStatus;
  whyThisLead: string;
  isMock: boolean;
  rejectionComment?: string;
}

export interface LeadDetail extends LeadSummary {
  teamContext: {
    teamSize: number;
    reportsTo: string;
  };
  signals: Signal[];
  scoreCriteria: ScoreCriterion[];
  discoveryQuestions: string[];
  recommendedApproach: string;
  outreach: OutreachDraft | null;
}

export interface SearchResult {
  id: string;
  target: SearchTarget;
  counts: SearchCounts;
  hierarchy: CountryNode[];
  leads: LeadSummary[];
}

export interface CreateSearchParams {
  offeringId: string;
  countryCode?: string;
  organization?: string;
  targetRoles: string[];
}
