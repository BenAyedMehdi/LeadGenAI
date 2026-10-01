import {
  Country,
  CreateSearchParams,
  LeadDetail,
  LeadStatus,
  LeadSummary,
  Offering,
  OutreachDraft,
  SearchResult
} from '../types';
import { mockCountries } from '../mocks/countries';
import { initialMockLeads } from '../mocks/leads';
import { mockOfferings } from '../mocks/offerings';
import { defaultAllOrganizations, mockOrganizationsByCountry } from '../mocks/organizations';
import { mockDefaultSearch, mockEmptySearchRomania } from '../mocks/searches';

const STORAGE_LEADS_KEY = 'leadgen_mock_leads_v1';
const STORAGE_SEARCHES_KEY = 'leadgen_mock_searches_v1';

// Helper to initialize local persisted leads
function getStoredLeads(): LeadDetail[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEADS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored leads', e);
  }
  return initialMockLeads;
}

function saveStoredLeads(leads: LeadDetail[]): void {
  try {
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save leads', e);
  }
}

// In-memory runtime state initialized from storage
let inMemoryLeads: LeadDetail[] = getStoredLeads();
let inMemorySearches: Record<string, SearchResult> = {
  's-001': {
    ...mockDefaultSearch,
    leads: inMemoryLeads.map((l) => ({
      rank: l.rank,
      id: l.id,
      name: l.name,
      title: l.title,
      roleType: l.roleType,
      orgUnit: l.orgUnit,
      city: l.city,
      score: l.score,
      scoreLabel: l.scoreLabel,
      confidence: l.confidence,
      status: l.status,
      whyThisLead: l.whyThisLead,
      isMock: l.isMock,
      rejectionComment: l.rejectionComment
    }))
  },
  's-ro-empty': mockEmptySearchRomania
};

// Simulate realistic API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetch available offerings
   */
  async getOfferings(): Promise<Offering[]> {
    await delay(120);
    return [...mockOfferings];
  },

  /**
   * Fetch available countries
   */
  async getCountries(): Promise<Country[]> {
    await delay(120);
    return [...mockCountries];
  },

  /**
   * Fetch organizations filtered by country
   */
  async getOrganizations(countryCode?: string): Promise<string[]> {
    await delay(100);
    if (!countryCode || countryCode === 'ALL') {
      return [...defaultAllOrganizations];
    }
    return [...(mockOrganizationsByCountry[countryCode] || defaultAllOrganizations)];
  },

  /**
   * Create a new search run
   */
  async createSearch(params: CreateSearchParams): Promise<SearchResult> {
    await delay(200);

    const isRomania = params.countryCode === 'RO';
    const offeringObj = mockOfferings.find((o) => o.id === params.offeringId) || mockOfferings[0];
    const countryObj = mockCountries.find((c) => c.code === params.countryCode);
    const countryName = countryObj ? countryObj.name : 'All countries';
    const orgName = params.organization || 'All organizations';

    if (isRomania) {
      const emptyResult: SearchResult = {
        id: `s-ro-${Date.now()}`,
        target: {
          offering: offeringObj.name,
          organization: orgName,
          country: 'Romania',
          targetRoles: params.targetRoles.length > 0 ? params.targetRoles : ['All roles']
        },
        counts: {
          locations: 0,
          orgUnits: 0,
          contacts: 0,
          leads: 0
        },
        hierarchy: [],
        leads: []
      };
      inMemorySearches[emptyResult.id] = emptyResult;
      return emptyResult;
    }

    // Default search result (s-001 or clone with updated target metadata)
    const currentLeads = inMemoryLeads.map((l) => ({
      rank: l.rank,
      id: l.id,
      name: l.name,
      title: l.title,
      roleType: l.roleType,
      orgUnit: l.orgUnit,
      city: l.city,
      score: l.score,
      scoreLabel: l.scoreLabel,
      confidence: l.confidence,
      status: l.status,
      whyThisLead: l.whyThisLead,
      isMock: l.isMock,
      rejectionComment: l.rejectionComment
    }));

    const searchId = 's-001';
    const result: SearchResult = {
      ...mockDefaultSearch,
      id: searchId,
      target: {
        offering: offeringObj.name,
        organization: orgName === 'All organizations' ? 'XC' : orgName,
        country: countryName === 'All countries' ? 'Hungary' : countryName,
        targetRoles: params.targetRoles.length > 0 ? params.targetRoles : ['IT leadership']
      },
      leads: currentLeads
    };

    inMemorySearches[searchId] = result;
    return result;
  },

  /**
   * Get search results by ID
   */
  async getSearch(id: string): Promise<SearchResult | null> {
    await delay(150);
    const search = inMemorySearches[id];
    if (!search) {
      // If s-001 is requested directly, load it
      if (id === 's-001') {
        return {
          ...mockDefaultSearch,
          leads: inMemoryLeads.map((l) => ({
            rank: l.rank,
            id: l.id,
            name: l.name,
            title: l.title,
            roleType: l.roleType,
            orgUnit: l.orgUnit,
            city: l.city,
            score: l.score,
            scoreLabel: l.scoreLabel,
            confidence: l.confidence,
            status: l.status,
            whyThisLead: l.whyThisLead,
            isMock: l.isMock,
            rejectionComment: l.rejectionComment
          }))
        };
      }
      return null;
    }

    // Sync latest lead statuses into search result
    const syncedLeads = search.leads.map((sl) => {
      const match = inMemoryLeads.find((l) => l.id === sl.id);
      return match
        ? {
            ...sl,
            status: match.status,
            rejectionComment: match.rejectionComment
          }
        : sl;
    });

    return {
      ...search,
      leads: syncedLeads
    };
  },

  /**
   * Get lead detail by ID
   */
  async getLead(id: string): Promise<LeadDetail | null> {
    await delay(150);
    const lead = inMemoryLeads.find((l) => l.id === id);
    if (!lead) return null;
    return JSON.parse(JSON.stringify(lead));
  },

  /**
   * Update lead status (APPROVE / REJECT)
   */
  async updateLeadStatus(id: string, status: LeadStatus, comment?: string): Promise<LeadDetail> {
    await delay(180);
    const index = inMemoryLeads.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error(`Lead ${id} not found`);
    }

    const updated: LeadDetail = {
      ...inMemoryLeads[index],
      status,
      rejectionComment: status === 'REJECTED' ? comment : undefined
    };

    inMemoryLeads[index] = updated;
    saveStoredLeads(inMemoryLeads);

    // Also update any searches containing this lead
    Object.keys(inMemorySearches).forEach((sId) => {
      const s = inMemorySearches[sId];
      if (s && s.leads) {
        s.leads = s.leads.map((l) => (l.id === id ? { ...l, status, rejectionComment: updated.rejectionComment } : l));
      }
    });

    return JSON.parse(JSON.stringify(updated));
  },

  /**
   * Generate outreach draft for a lead
   */
  async generateOutreach(leadId: string, offeringName: string = 'IT Landscape Management'): Promise<OutreachDraft> {
    await delay(1500); // Specified fake 1.5s loading

    const lead = inMemoryLeads.find((l) => l.id === leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    let draft: OutreachDraft;

    if (leadId === 'lead-001') {
      draft = {
        subject: 'Exploring the OneDriving and ADA toolchain convergence together',
        body: 'Hi Anna, I came across the XC-AS announcement about unifying the OneDriving and ADA code bases. In GS/BDO we are currently working on IT landscape and toolchain transparency for engineering units, and I thought it might be worthwhile to exchange on how you are approaching the consolidation of ALM and CI/CD tooling. Would you have 30 minutes for an initial discussion? Best regards, [Your name], GS/BDO',
        generatedBy: 'AI-generated (mock)',
        lastSavedAt: new Date().toISOString()
      };
    } else {
      // Mock outreach template for leads without prepared draft:
      // fill with contact's first name, a short phrase from top signal, and offering name
      const firstName = lead.name.split(' ')[0] || lead.name;
      const topSignal = lead.signals[0];
      const signalContext = topSignal
        ? topSignal.fact.slice(0, 85).replace(/\.$/, '')
        : 'recent developments in your engineering organization';
      const challengePhrase = topSignal ? topSignal.openQuestion : 'toolchain and application ownership';

      draft = {
        subject: `Exploring ${lead.orgUnit} toolchain alignment together`,
        body: `Hi ${firstName}, I came across ${signalContext}. In GS/BDO we are currently working on ${offeringName}, and I thought it might be worthwhile to exchange on how you are approaching ${challengePhrase}. Would you have 30 minutes for an initial discussion? Best regards, [Your name], GS/BDO`,
        generatedBy: 'AI-generated (mock)',
        lastSavedAt: new Date().toISOString()
      };
    }

    // Persist draft into in-memory lead
    lead.outreach = draft;
    saveStoredLeads(inMemoryLeads);

    return JSON.parse(JSON.stringify(draft));
  },

  /**
   * Save manual edits to an outreach draft
   */
  async saveOutreach(leadId: string, draft: OutreachDraft): Promise<OutreachDraft> {
    await delay(180);
    const lead = inMemoryLeads.find((l) => l.id === leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const updatedDraft: OutreachDraft = {
      ...draft,
      lastSavedAt: new Date().toISOString()
    };
    lead.outreach = updatedDraft;
    saveStoredLeads(inMemoryLeads);
    return updatedDraft;
  },

  /**
   * Reset mock data to initial baseline (useful for testing demo path)
   */
  resetMockData(): void {
    inMemoryLeads = JSON.parse(JSON.stringify(initialMockLeads));
    saveStoredLeads(inMemoryLeads);
    inMemorySearches = {
      's-001': {
        ...mockDefaultSearch,
        leads: inMemoryLeads.map((l) => ({
          rank: l.rank,
          id: l.id,
          name: l.name,
          title: l.title,
          roleType: l.roleType,
          orgUnit: l.orgUnit,
          city: l.city,
          score: l.score,
          scoreLabel: l.scoreLabel,
          confidence: l.confidence,
          status: l.status,
          whyThisLead: l.whyThisLead,
          isMock: l.isMock,
          rejectionComment: l.rejectionComment
        }))
      },
      's-ro-empty': mockEmptySearchRomania
    };
  }
};
