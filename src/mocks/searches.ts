import { SearchResult, SearchTarget } from '../types';
import { initialMockLeads } from './leads';

export const mockDefaultSearch: SearchResult = {
  id: 's-001',
  target: {
    offering: 'IT Landscape Management',
    organization: 'XC',
    country: 'Hungary',
    targetRoles: ['IT leadership']
  },
  counts: {
    locations: 2,
    orgUnits: 5,
    contacts: 14,
    leads: 8
  },
  hierarchy: [
    {
      name: 'Hungary',
      locations: [
        {
          name: 'Budapest',
          orgUnits: [
            { name: 'XC-AS ADAS Systems & Software', contactCount: 4 },
            { name: 'XC-AC ADAS Components', contactCount: 2 },
            { name: 'XC-CP Compute Performance', contactCount: 3 }
          ]
        },
        {
          name: 'Hatvan',
          orgUnits: [
            { name: 'XC-CE Compute Enhanced', contactCount: 3 },
            { name: 'XC-HWP Hardware Platform', contactCount: 2 }
          ]
        }
      ]
    }
  ],
  leads: initialMockLeads.map((l) => ({
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

export const mockEmptySearchRomania: SearchResult = {
  id: 's-ro-empty',
  target: {
    offering: 'IT Landscape Management',
    organization: 'Example BU Powertrain (mock)',
    country: 'Romania',
    targetRoles: ['IT leadership']
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
