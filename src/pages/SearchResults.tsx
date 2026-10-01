import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '../router';
import { SearchResult, OrgUnitNode, LocationNode } from '../types';
import { api } from '../services/api';
import { MockPill, StatusChip, ConfidenceBadge } from '../components/common/Badges';
import { SearchResultsSkeleton } from '../components/common/Skeletons';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  MapPin,
  Users,
  Compass,
  ArrowLeft,
  ChevronLeft,
  Info,
  Filter
} from 'lucide-react';

export const SearchResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Hierarchy tree collapsed/expanded state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    Hungary: true,
    Budapest: true,
    Hatvan: true
  });

  // Optional org unit filter
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string | null>(null);

  // Load search data on mount or when id changes.
  // Re-fetches so when user navigates back from /leads/:id, status chips are current!
  useEffect(() => {
    let isMounted = true;
    async function fetchSearch() {
      setIsLoading(true);
      try {
        const result = await api.getSearch(id || 's-001');
        if (!isMounted) return;
        if (!result) {
          setNotFound(true);
        } else {
          setSearchData(result);
        }
      } catch (err) {
        console.error('Failed to load search', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchSearch();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleExpand = (nodeKey: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  if (isLoading) {
    return <SearchResultsSkeleton />;
  }

  if (notFound || !searchData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Search not found</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            The requested search identification <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">{id}</code> could not be found or has expired.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED0007] text-white text-xs font-semibold rounded-lg hover:bg-[#d10006] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Configure new search</span>
          </Link>
        </div>
      </div>
    );
  }

  // Empty state when counts.contacts is 0 (as specified in prompt: "No contacts found for this target" and a "Change target" button)
  if (searchData.counts.contacts === 0 || searchData.leads.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with target summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Target Search</span>
                <span>·</span>
                <span className="font-mono text-slate-400">{searchData.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {searchData.target.offering}
              </h1>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007BC0] hover:text-[#005f96] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              Change target
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 pt-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Country:</span>{' '}
              <strong className="text-slate-800">{searchData.target.country}</strong>
            </div>
            <div>
              <span className="text-slate-400">Organization:</span>{' '}
              <strong className="text-slate-800">{searchData.target.organization}</strong>
            </div>
          </div>
        </div>

        {/* Empty state message */}
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">No contacts found for this target</h2>
          <p className="text-sm text-slate-600 mb-6">
            We couldn't map active engineering contacts matching the selected criteria in {searchData.target.country}. Try expanding your organization or country filters.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED0007] text-white text-xs font-semibold rounded-lg hover:bg-[#d10006] transition-colors"
          >
            <span>Change target</span>
          </Link>
        </div>
      </div>
    );
  }

  // Filter leads if an org unit is selected in the hierarchy tree
  const displayedLeads = selectedOrgFilter
    ? searchData.leads.filter((l) => l.orgUnit === selectedOrgFilter || selectedOrgFilter.includes(l.orgUnit))
    : searchData.leads;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header with Target Summary & 4 Count Tiles */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[#007BC0]">Search Results</span>
              <span>·</span>
              <span className="font-mono text-slate-400">{searchData.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {searchData.target.offering}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
              <span>
                Organization: <strong className="text-slate-800">{searchData.target.organization}</strong>
              </span>
              <span>·</span>
              <span>
                Country: <strong className="text-slate-800">{searchData.target.country}</strong>
              </span>
              <span>·</span>
              <span>
                Target Roles:{' '}
                <strong className="text-slate-800">
                  {searchData.target.targetRoles.join(', ')}
                </strong>
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#007BC0] hover:text-[#005f96] hover:bg-sky-50 rounded-md transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Change target
          </Link>
        </div>

        {/* Four Count Tiles from API */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Locations</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {searchData.counts.locations}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Org units</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {searchData.counts.orgUnits}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Contacts mapped</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {searchData.counts.contacts}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <Compass className="w-3.5 h-3.5 text-[#007BC0]" />
              <span className="text-[#007BC0] font-semibold">Ranked leads</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {searchData.counts.leads}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Hierarchy Tree + Right Lead List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Collapsible Hierarchy Tree */}
        <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#007BC0]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Organization Tree
              </h2>
            </div>
            {selectedOrgFilter && (
              <button
                onClick={() => setSelectedOrgFilter(null)}
                className="text-[11px] text-[#007BC0] hover:underline font-medium"
              >
                Clear filter
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Collapsible structure of mapped business units and contact counts:
          </p>

          <div className="space-y-2 text-xs">
            {searchData.hierarchy.map((countryNode) => {
              const isCountryExpanded = expandedNodes[countryNode.name] ?? true;
              return (
                <div key={countryNode.name} className="space-y-1.5">
                  {/* Country level */}
                  <button
                    onClick={() => toggleExpand(countryNode.name)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-left font-semibold text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isCountryExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{countryNode.name}</span>
                    </div>
                  </button>

                  {/* Locations */}
                  {isCountryExpanded && (
                    <div className="pl-4 space-y-1 border-l border-slate-200 ml-3">
                      {countryNode.locations.map((loc) => {
                        const isLocExpanded = expandedNodes[loc.name] ?? true;
                        return (
                          <div key={loc.name} className="space-y-1">
                            <button
                              onClick={() => toggleExpand(loc.name)}
                              className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-slate-50 text-left font-medium text-slate-700 transition-colors"
                            >
                              <div className="flex items-center gap-1.5">
                                {isLocExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-slate-400" />
                                )}
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{loc.name}</span>
                              </div>
                            </button>

                            {/* Org Units with contact counts */}
                            {isLocExpanded && (
                              <div className="pl-4 space-y-1 border-l border-slate-200 ml-2">
                                {loc.orgUnits.map((orgUnit) => {
                                  const isSelected = selectedOrgFilter === orgUnit.name || selectedOrgFilter?.startsWith(orgUnit.name.split(' ')[0]);
                                  const orgPrefix = orgUnit.name.split(' ')[0];
                                  return (
                                    <button
                                      key={orgUnit.name}
                                      onClick={() => {
                                        setSelectedOrgFilter(isSelected ? null : orgPrefix);
                                      }}
                                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                                        isSelected
                                          ? 'bg-sky-50 text-[#007BC0] font-semibold border border-sky-200'
                                          : 'hover:bg-slate-50 text-slate-600'
                                      }`}
                                    >
                                      <span className="truncate pr-2" title={orgUnit.name}>
                                        {orgUnit.name}
                                      </span>
                                      <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-600 shrink-0">
                                        {orgUnit.contactCount}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main: Ranked Lead List */}
        <main className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800">
                Ranked Leads ({displayedLeads.length})
              </h2>
              {selectedOrgFilter && (
                <span className="text-xs text-slate-500 font-medium">
                  filtered by: <span className="text-[#007BC0]">{selectedOrgFilter}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Prioritization score, not a probability of sale</span>
            </div>
          </div>

          {/* Lead Table / Row List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {displayedLeads.map((lead) => {
              // Score bar styling
              const scorePercent = Math.min(100, Math.max(0, lead.score));

              return (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 cursor-pointer transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/leads/${lead.id}`);
                    }
                  }}
                >
                  {/* Left: Rank, Name, Title, Org, City, WhyThisLead */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Rank Badge */}
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#007BC0] group-hover:text-white transition-colors">
                      {lead.rank}
                    </span>

                    <div className="min-w-0 flex-1">
                      {/* Name, Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-[#007BC0] transition-colors truncate">
                          {lead.name}
                        </span>

                        {lead.isMock && <MockPill />}

                        <StatusChip status={lead.status} />

                        <ConfidenceBadge confidence={lead.confidence} />
                      </div>

                      {/* Title & Organization */}
                      <div className="text-xs text-slate-600 mb-1.5 flex flex-wrap items-center gap-x-2">
                        <span className="font-medium text-slate-800">{lead.title}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-600">{lead.orgUnit}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">{lead.city}</span>
                      </div>

                      {/* Why this lead summary */}
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        "{lead.whyThisLead}"
                      </p>
                    </div>
                  </div>

                  {/* Right: Prioritization Score Bar */}
                  <div className="flex items-center gap-4 sm:shrink-0 sm:pl-4 sm:border-l border-slate-100">
                    <div
                      className="flex flex-col items-end w-28"
                      title="Prioritization score, not a probability of sale"
                    >
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                          {lead.score}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">/ 100</span>
                      </div>

                      {/* Score Bar with tooltip */}
                      <div
                        className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"
                        title="Prioritization score, not a probability of sale"
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            lead.score >= 80
                              ? 'bg-emerald-500'
                              : lead.score >= 60
                              ? 'bg-[#007BC0]'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${scorePercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">
                        {lead.scoreLabel}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
