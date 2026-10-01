import { LeadDetail } from '../types';

export const initialMockLeads: LeadDetail[] = [
  {
    rank: 1,
    id: 'lead-001',
    name: 'Anna Kovács',
    title: 'Head of Toolchain & Engineering IT',
    roleType: 'Decision maker',
    orgUnit: 'XC-AS',
    city: 'Budapest',
    score: 90,
    scoreLabel: 'Strong match',
    confidence: 'HIGH',
    status: 'NEW',
    whyThisLead: 'Unifying the OneDriving and ADA code bases drives toolchain consolidation.',
    isMock: true,
    teamContext: {
      teamSize: 38,
      reportsTo: 'VP Engineering, XC-AS'
    },
    signals: [
      {
        id: 'sig-001-1',
        fact: 'XC-AS announced a unified code base for OneDriving and ADA, merging two previously separate development organizations.',
        source: {
          name: 'XC Townhall summary (Docupedia)',
          lastUpdated: '2026-08-14',
          isMock: true
        },
        hypothesis: 'Merging two organizations typically leaves duplicate MBSE, ALM and CI/CD toolchains that need one reliable application inventory.',
        serviceMatch: 'IT Landscape Management: Toolchain Consolidation (LeanIX)',
        openQuestion: 'How are ALM and CI/CD pipelines being consolidated for the unified code base, and who owns the application inventory?'
      },
      {
        id: 'sig-001-2',
        fact: 'The department page lists 11 engineering applications, 6 without a named IT owner.',
        source: {
          name: 'Org Manager export, September 2026',
          lastUpdated: '2026-09-02',
          isMock: true
        },
        hypothesis: 'Engineering leads may be acting as IT owners alongside development work.',
        serviceMatch: 'IT Landscape Management: IT Owner as a Service',
        openQuestion: 'How much developer time goes into governance and factsheet maintenance today?'
      },
      {
        id: 'sig-001-3',
        fact: 'A newsletter mentions cost-optimization targets for the unit.',
        source: {
          name: 'XC Newsletter Q1',
          lastUpdated: '2026-01-20',
          isMock: true
        },
        hypothesis: 'Cost pressure increases interest in removing duplicate tooling.',
        serviceMatch: 'IT Landscape Management: reduce duplicate R&D tooling',
        openQuestion: 'Which tools are candidates for retirement?'
      }
    ],
    scoreCriteria: [
      {
        criterion: 'Service fit',
        rating: 'HIGH',
        points: 24,
        maxPoints: 25,
        reason: 'Two signals map directly to toolchain consolidation'
      },
      {
        criterion: 'Business signal',
        rating: 'HIGH',
        points: 18,
        maxPoints: 20,
        reason: 'Active organizational convergence'
      },
      {
        criterion: 'Role relevance',
        rating: 'HIGH',
        points: 14,
        maxPoints: 15,
        reason: 'Owns toolchain and engineering IT'
      },
      {
        criterion: 'Organizational relevance',
        rating: 'HIGH',
        points: 10,
        maxPoints: 10,
        reason: 'XC-AS is in scope'
      },
      {
        criterion: 'Location relevance',
        rating: 'HIGH',
        points: 10,
        maxPoints: 10,
        reason: 'Budapest matches the filter'
      },
      {
        criterion: 'Relationship signal',
        rating: 'LOW',
        points: 1,
        maxPoints: 5,
        reason: 'No connection data found'
      },
      {
        criterion: 'Evidence quality',
        rating: 'HIGH',
        points: 13,
        maxPoints: 15,
        reason: 'Two fresh sources, one outdated'
      }
    ],
    discoveryQuestions: [
      'How are you consolidating ALM and CI/CD for the unified code base?',
      'Who owns the application inventory and factsheet accuracy today?',
      'Where does the team lose the most time on tool governance?'
    ],
    recommendedApproach: 'Discovery first. Open with the code base unification, listen to pain points, and only then connect them to IT Landscape Management.',
    outreach: null
  },
  {
    rank: 2,
    id: 'lead-002',
    name: 'Márton Szabó',
    title: 'Director Product Area ADAS Components',
    roleType: 'Decision maker',
    orgUnit: 'XC-AC',
    city: 'Budapest',
    score: 82,
    scoreLabel: 'Strong match',
    confidence: 'HIGH',
    status: 'APPROVED',
    whyThisLead: 'Cost-reduction mandate and overlapping simulation tools suggest duplicate tooling.',
    isMock: true,
    teamContext: {
      teamSize: 52,
      reportsTo: 'VP ADAS Components, XC-AC'
    },
    signals: [
      {
        id: 'sig-002-1',
        fact: 'XC-AC is reducing external engineering service provider spend as part of a free cash flow improvement program.',
        source: {
          name: 'XC Strategy Briefing',
          lastUpdated: '2026-07-10',
          isMock: true
        },
        hypothesis: 'Less external spend increases pressure to remove duplicate simulation and test tooling.',
        serviceMatch: 'IT Landscape Management: reduce duplicate R&D tooling',
        openQuestion: 'Which tools are candidates for retirement, and who decides?'
      },
      {
        id: 'sig-002-2',
        fact: 'Three simulation environments are listed on the department page, two from the same vendor.',
        source: {
          name: 'Docupedia team page',
          lastUpdated: '2026-08-30',
          isMock: true
        },
        hypothesis: 'Overlapping simulation tools may indicate consolidation potential.',
        serviceMatch: 'IT Landscape Management: Toolchain Consolidation (LeanIX)',
        openQuestion: 'Are the simulation environments planned to converge?'
      }
    ],
    scoreCriteria: [
      {
        criterion: 'Service fit',
        rating: 'HIGH',
        points: 22,
        maxPoints: 25,
        reason: 'Direct mandate to trim tool duplication and vendor contracts'
      },
      {
        criterion: 'Business signal',
        rating: 'HIGH',
        points: 16,
        maxPoints: 20,
        reason: 'Free cash flow improvement program underway'
      },
      {
        criterion: 'Role relevance',
        rating: 'MEDIUM',
        points: 9,
        maxPoints: 15,
        reason: 'Business leader, not the tool owner'
      },
      {
        criterion: 'Organizational relevance',
        rating: 'HIGH',
        points: 10,
        maxPoints: 10,
        reason: 'XC-AC unit is priority target'
      },
      {
        criterion: 'Location relevance',
        rating: 'HIGH',
        points: 10,
        maxPoints: 10,
        reason: 'Budapest development hub'
      },
      {
        criterion: 'Relationship signal',
        rating: 'LOW',
        points: 1,
        maxPoints: 5,
        reason: 'No connection data found'
      },
      {
        criterion: 'Evidence quality',
        rating: 'HIGH',
        points: 14,
        maxPoints: 15,
        reason: 'Two verified high-recency internal sources'
      }
    ],
    discoveryQuestions: [
      'How are you approaching the consolidation of overlapping simulation packages?',
      'Who in your organization governs software factsheets and license renewals?',
      'What are your primary milestones for reducing external tool expenditures?'
    ],
    recommendedApproach: 'Discovery first. Acknowledge the cash flow optimization targets and explore engineering satisfaction with current simulation setups before presenting options.',
    outreach: {
      subject: 'Exploring simulation toolchain efficiency in XC-AC',
      body: 'Hi Márton, I came across the XC-AC initiative around optimizing external engineering spend and simulation environments. In GS/BDO we are currently working on toolchain transparency and LeanIX consolidation for engineering divisions, and I thought it might be worthwhile to exchange on how you are approaching overlapping simulation packages. Would you have 30 minutes for an initial discussion? Best regards, [Your name], GS/BDO',
      generatedBy: 'AI-generated (mock)'
    }
  },
  {
    rank: 3,
    id: 'lead-003',
    name: 'Eszter Nagy',
    title: 'Head of Compute Platform IT',
    roleType: 'Decision maker',
    orgUnit: 'XC-CP',
    city: 'Budapest',
    score: 74,
    scoreLabel: 'Good match',
    confidence: 'MEDIUM',
    status: 'NEW',
    whyThisLead: 'Platform IT owns several engineering applications without named IT owners.',
    isMock: true,
    teamContext: {
      teamSize: 24,
      reportsTo: 'VP Compute Platform, XC-CP'
    },
    signals: [
      {
        id: 'sig-003-1',
        fact: 'XC-CP department lists 8 core compute platforms and middleware tools, with 4 missing certified application owners.',
        source: {
          name: 'IT Governance Audit Log',
          lastUpdated: '2026-08-05',
          isMock: true
        },
        hypothesis: 'Platform teams lack bandwidth for lifecycle governance and compliance checks.',
        serviceMatch: 'IT Landscape Management: IT Owner as a Service',
        openQuestion: 'Who handles audits and compliance reviews for internal middleware stacks?'
      },
      {
        id: 'sig-003-2',
        fact: 'Recent platform roadmap indicates migration to unified cloud container registries.',
        source: {
          name: 'Platform Architecture Deck',
          lastUpdated: '2026-06-18',
          isMock: true
        },
        hypothesis: 'Cloud migration demands clean mapping of dependencies and retirement of legacy nodes.',
        serviceMatch: 'IT Landscape Management: toolchain consolidation',
        openQuestion: 'How are legacy compute tools inventoried before cloud lift-and-shift?'
      }
    ],
    scoreCriteria: [
      { criterion: 'Service fit', rating: 'HIGH', points: 19, maxPoints: 25, reason: 'Strong need for IT Owner as a Service' },
      { criterion: 'Business signal', rating: 'MEDIUM', points: 14, maxPoints: 20, reason: 'Cloud modernization roadmap published' },
      { criterion: 'Role relevance', rating: 'HIGH', points: 12, maxPoints: 15, reason: 'Department head over compute platform IT' },
      { criterion: 'Organizational relevance', rating: 'HIGH', points: 9, maxPoints: 10, reason: 'Key technical infrastructure unit' },
      { criterion: 'Location relevance', rating: 'HIGH', points: 10, maxPoints: 10, reason: 'Budapest central engineering site' },
      { criterion: 'Relationship signal', rating: 'LOW', points: 1, maxPoints: 5, reason: 'No prior GS/BDO engagement record' },
      { criterion: 'Evidence quality', rating: 'MEDIUM', points: 9, maxPoints: 15, reason: 'One recent audit log, one moderate roadmap' }
    ],
    discoveryQuestions: [
      'How are unowned middleware tools maintained during audit cycles?',
      'What challenges have emerged in factsheet accuracy as platforms move to containers?',
      'Could external IT Ownership relieve engineering time for your senior architects?'
    ],
    recommendedApproach: 'Discovery first. Inquire about the time platform architects spend on compliance documentation rather than architectural innovation.',
    outreach: null
  },
  {
    rank: 4,
    id: 'lead-004',
    name: 'Gábor Tóth',
    title: 'Application Owner Simulation Cloud',
    roleType: 'Technical contact',
    orgUnit: 'XC-AS',
    city: 'Budapest',
    score: 68,
    scoreLabel: 'Good match',
    confidence: 'MEDIUM',
    status: 'NEW',
    whyThisLead: 'Owns a cloud simulation application likely affected by consolidation.',
    isMock: true,
    teamContext: {
      teamSize: 12,
      reportsTo: 'Head of Toolchain & Engineering IT, XC-AS'
    },
    signals: [
      {
        id: 'sig-004-1',
        fact: 'Currently named application owner for Simulation Cloud instance across 3 ADAS project teams.',
        source: {
          name: 'LeanIX Application Repository',
          lastUpdated: '2026-08-25',
          isMock: true
        },
        hypothesis: 'Facing high maintenance burden keeping up with user permissions and license allocations.',
        serviceMatch: 'IT Landscape Management: IT Owner as a Service',
        openQuestion: 'How much time do you spend managing access requests versus technical improvements?'
      },
      {
        id: 'sig-004-2',
        fact: 'Simulation cluster is preparing integration with new continuous testing farm.',
        source: {
          name: 'ADAS Engineering Portal',
          lastUpdated: '2026-05-12',
          isMock: true
        },
        hypothesis: 'Integration risks duplicate pipelines if not mapped centrally.',
        serviceMatch: 'IT Landscape Management: Toolchain Consolidation (LeanIX)',
        openQuestion: 'Are test farm tools integrated into the global catalog?'
      }
    ],
    scoreCriteria: [
      { criterion: 'Service fit', rating: 'HIGH', points: 18, maxPoints: 25, reason: 'Direct operational user of toolchain governance' },
      { criterion: 'Business signal', rating: 'MEDIUM', points: 12, maxPoints: 20, reason: 'Upcoming test farm integration' },
      { criterion: 'Role relevance', rating: 'MEDIUM', points: 11, maxPoints: 15, reason: 'Technical contact rather than budget owner' },
      { criterion: 'Organizational relevance', rating: 'HIGH', points: 9, maxPoints: 10, reason: 'XC-AS core team' },
      { criterion: 'Location relevance', rating: 'HIGH', points: 10, maxPoints: 10, reason: 'Budapest site' },
      { criterion: 'Relationship signal', rating: 'LOW', points: 1, maxPoints: 5, reason: 'No prior connection record' },
      { criterion: 'Evidence quality', rating: 'MEDIUM', points: 7, maxPoints: 15, reason: 'One repository entry and one older portal update' }
    ],
    discoveryQuestions: [
      'What administrative tasks take the most time away from cloud simulation tuning?',
      'How do you manage lifecycle reviews for simulation software plugins?',
      'Are there redundant licenses between project teams running local copies?'
    ],
    recommendedApproach: 'Discovery first. Speak engineer-to-engineer about operational tooling friction and administrative overhead before discussing enterprise services.',
    outreach: null
  },
  {
    rank: 5,
    id: 'lead-005',
    name: 'Júlia Varga',
    title: 'Engineering Operations Lead',
    roleType: 'Decision maker',
    orgUnit: 'XC-CE',
    city: 'Hatvan',
    score: 61,
    scoreLabel: 'Good match',
    confidence: 'MEDIUM',
    status: 'NEW',
    whyThisLead: 'Manual data collection for tool inventories points to governance effort.',
    isMock: true,
    teamContext: {
      teamSize: 18,
      reportsTo: 'Director Operations, XC-CE'
    },
    signals: [
      {
        id: 'sig-005-1',
        fact: 'Internal operational minutes record 40+ engineering hours spent manually aggregating software inventory spreadsheets.',
        source: {
          name: 'XC-CE Operations Sync',
          lastUpdated: '2026-07-28',
          isMock: true
        },
        hypothesis: 'Lack of automated LeanIX workflows requires manual audits and spreadsheet tracking.',
        serviceMatch: 'IT Landscape Management: Toolchain Consolidation (LeanIX)',
        openQuestion: 'How often does your unit conduct manual spreadsheet tool audits?'
      },
      {
        id: 'sig-005-2',
        fact: 'Hatvan facility is harmonizing manufacturing-adjacent software with headquarters guidelines.',
        source: {
          name: 'Plant Digitalization Roadmap',
          lastUpdated: '2026-04-15',
          isMock: true
        },
        hypothesis: 'Plant-level tools often escape standard enterprise software catalogs.',
        serviceMatch: 'IT Landscape Management: IT Owner as a Service',
        openQuestion: 'Which shop-floor engineering tools currently lack standard IT owners?'
      }
    ],
    scoreCriteria: [
      { criterion: 'Service fit', rating: 'MEDIUM', points: 15, maxPoints: 25, reason: 'Strong match to manual audit elimination' },
      { criterion: 'Business signal', rating: 'MEDIUM', points: 11, maxPoints: 20, reason: 'Plant digitalization directive active' },
      { criterion: 'Role relevance', rating: 'MEDIUM', points: 11, maxPoints: 15, reason: 'Operations lead managing tool processes' },
      { criterion: 'Organizational relevance', rating: 'MEDIUM', points: 8, maxPoints: 10, reason: 'XC-CE manufacturing/engineering edge' },
      { criterion: 'Location relevance', rating: 'MEDIUM', points: 8, maxPoints: 10, reason: 'Hatvan plant site' },
      { criterion: 'Relationship signal', rating: 'LOW', points: 1, maxPoints: 5, reason: 'No prior connection record' },
      { criterion: 'Evidence quality', rating: 'MEDIUM', points: 7, maxPoints: 15, reason: 'Operational minutes plus plant roadmap' }
    ],
    discoveryQuestions: [
      'How much effort does your team spend consolidating tool inventories before audits?',
      'Are engineering tools at Hatvan synchronized with central LeanIX factsheets?',
      'What would an automated tool catalog save in monthly engineering hours?'
    ],
    recommendedApproach: 'Discovery first. Explore the friction of manual spreadsheet tracking and audit compliance in manufacturing-adjacent operations.',
    outreach: null
  },
  {
    rank: 6,
    id: 'lead-006',
    name: 'Péter Horváth',
    title: 'Head of HW Platform Development',
    roleType: 'Decision maker',
    orgUnit: 'XC-HWP',
    city: 'Hatvan',
    score: 53,
    scoreLabel: 'Weak match',
    confidence: 'LOW',
    status: 'NEW',
    whyThisLead: 'Few IT toolchain signals found; relevance is indirect.',
    isMock: true,
    teamContext: {
      teamSize: 45,
      reportsTo: 'VP Hardware Solutions, XC'
    },
    signals: [
      {
        id: 'sig-006-1',
        fact: 'Hardware test lab reports legacy oscilloscopes and firmware flashing stations using custom scripting environments.',
        source: null, // Low evidence warning!
        hypothesis: 'Custom lab tools frequently lack IT governance and security lifecycle updates.',
        serviceMatch: 'IT Landscape Management: IT Owner as a Service',
        openQuestion: 'Who is accountable for patching and certifying lab-specific test software?'
      },
      {
        id: 'sig-006-2',
        fact: 'Hardware development schedules show upcoming milestone for prototype electronic control unit validation.',
        source: {
          name: 'XC-HWP Lab Schedule',
          lastUpdated: '2026-02-10',
          isMock: true
        },
        hypothesis: 'High pressure on delivery may make hardware leads hesitant to change tooling.',
        serviceMatch: 'IT Landscape Management: reduce duplicate R&D tooling',
        openQuestion: 'Are hardware test toolchains unified with software CI pipelines?'
      }
    ],
    scoreCriteria: [
      { criterion: 'Service fit', rating: 'LOW', points: 12, maxPoints: 25, reason: 'Hardware focus limits immediate software toolchain relevance' },
      { criterion: 'Business signal', rating: 'LOW', points: 9, maxPoints: 20, reason: 'No explicit IT restructuring announced' },
      { criterion: 'Role relevance', rating: 'MEDIUM', points: 10, maxPoints: 15, reason: 'Senior hardware decision maker' },
      { criterion: 'Organizational relevance', rating: 'MEDIUM', points: 8, maxPoints: 10, reason: 'XC-HWP hardware division' },
      { criterion: 'Location relevance', rating: 'MEDIUM', points: 8, maxPoints: 10, reason: 'Hatvan facility' },
      { criterion: 'Relationship signal', rating: 'LOW', points: 1, maxPoints: 5, reason: 'No prior contact' },
      { criterion: 'Evidence quality', rating: 'LOW', points: 5, maxPoints: 15, reason: 'One unverified signal and one outdated schedule' }
    ],
    discoveryQuestions: [
      'How are lab and firmware test benches inventoried in central IT registers?',
      'Do custom test scripts undergo security or obsolescence checks?',
      'Who coordinates between hardware engineering and corporate IT?'
    ],
    recommendedApproach: 'Discovery first. Frame the discussion around lab compliance and offloading administrative paperwork from hardware engineers.',
    outreach: null
  },
  {
    rank: 7,
    id: 'lead-007',
    name: 'Dóra Kiss',
    title: 'Team Lead Test Automation',
    roleType: 'Technical contact',
    orgUnit: 'XC-AC',
    city: 'Budapest',
    score: 47,
    scoreLabel: 'Weak match',
    confidence: 'LOW',
    status: 'REJECTED',
    whyThisLead: 'Relevant tools exist but no business signal found.',
    isMock: true,
    rejectionComment: 'Lead rejected during previous quarterly review: test automation stack already governed under regional QA charter.',
    teamContext: {
      teamSize: 15,
      reportsTo: 'Head of Quality & Verification, XC-AC'
    },
    signals: [
      {
        id: 'sig-007-1',
        fact: 'Maintains automated regression test suites on Jenkins and proprietary HIL racks.',
        source: null, // Low evidence warning!
        hypothesis: 'Test automation infrastructure has distinct specialized needs from general IT toolchains.',
        serviceMatch: 'IT Landscape Management: toolchain consolidation',
        openQuestion: 'Are HIL simulation test environments part of the central software asset inventory?'
      },
      {
        id: 'sig-007-2',
        fact: 'Departmental wiki shows recent standardization on Robot Framework.',
        source: {
          name: 'XC-AC Verification Wiki',
          lastUpdated: '2025-11-14',
          isMock: true
        },
        hypothesis: 'Standardization already completed recently; limited immediate appetite for new governance projects.',
        serviceMatch: 'IT Landscape Management: reduce duplicate R&D tooling',
        openQuestion: 'Has test framework standardization met target savings?'
      }
    ],
    scoreCriteria: [
      { criterion: 'Service fit', rating: 'LOW', points: 11, maxPoints: 25, reason: 'Test framework standardization was concluded recently' },
      { criterion: 'Business signal', rating: 'LOW', points: 8, maxPoints: 20, reason: 'No current cost-cutting or restructuring trigger' },
      { criterion: 'Role relevance', rating: 'LOW', points: 8, maxPoints: 15, reason: 'Team lead with operational technical remit' },
      { criterion: 'Organizational relevance', rating: 'MEDIUM', points: 8, maxPoints: 10, reason: 'XC-AC unit' },
      { criterion: 'Location relevance', rating: 'MEDIUM', points: 7, maxPoints: 10, reason: 'Budapest site' },
      { criterion: 'Relationship signal', rating: 'LOW', points: 1, maxPoints: 5, reason: 'Previously declined' },
      { criterion: 'Evidence quality', rating: 'LOW', points: 4, maxPoints: 15, reason: 'Unverified primary signal and outdated wiki entry' }
    ],
    discoveryQuestions: [
      'Has the Robot Framework consolidation satisfied your operational targets?',
      'Are test frameworks integrated into the global IT asset catalog?',
      'Where do you still encounter tooling overlap across ADAS verification teams?'
    ],
    recommendedApproach: 'Discovery first. Listen for remaining pain points in hardware-in-the-loop test licenses; do not push immediate changes.',
    outreach: null
  },
  {
    rank: 8,
    id: 'lead-008',
    name: 'László Molnár',
    title: 'Software Quality Manager',
    roleType: 'Technical contact',
    orgUnit: 'XC-CE',
    city: 'Hatvan',
    score: 41,
    scoreLabel: 'Weak match',
    confidence: 'LOW',
    status: 'NEW',
    whyThisLead: 'Limited evidence; possible contact for tool ownership questions.',
    isMock: true,
    teamContext: {
      teamSize: 8,
      reportsTo: 'Head of Quality Assurance, XC-CE'
    },
    signals: [
      {
        id: 'sig-008-1',
        fact: 'Listed as reviewer for software release compliance checks at Hatvan.',
        source: null, // Low evidence warning!
        hypothesis: 'Quality managers often identify unapproved software packages during pre-release gates.',
        serviceMatch: 'IT Landscape Management: IT Owner as a Service',
        openQuestion: 'How often do uncertified software tools delay release gating?'
      }
    ],
    scoreCriteria: [
      { criterion: 'Service fit', rating: 'LOW', points: 9, maxPoints: 25, reason: 'Compliance gatekeeper rather than landscape owner' },
      { criterion: 'Business signal', rating: 'LOW', points: 7, maxPoints: 20, reason: 'No organizational initiative detected' },
      { criterion: 'Role relevance', rating: 'LOW', points: 7, maxPoints: 15, reason: 'Quality compliance officer' },
      { criterion: 'Organizational relevance', rating: 'MEDIUM', points: 7, maxPoints: 10, reason: 'XC-CE secondary engineering site' },
      { criterion: 'Location relevance', rating: 'MEDIUM', points: 7, maxPoints: 10, reason: 'Hatvan site' },
      { criterion: 'Relationship signal', rating: 'LOW', points: 1, maxPoints: 5, reason: 'No recorded interactions' },
      { criterion: 'Evidence quality', rating: 'LOW', points: 3, maxPoints: 15, reason: 'Single unverified signal with missing source log' }
    ],
    discoveryQuestions: [
      'What percentage of release reviews flag uncertified third-party software?',
      'Who assumes ownership when an unapproved developer tool is identified?',
      'Would automated LeanIX factsheets accelerate release sign-offs?'
    ],
    recommendedApproach: 'Discovery first. Inquire into release gate delays caused by missing tool documentation.',
    outreach: null
  }
];
