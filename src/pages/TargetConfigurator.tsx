import React, { useState, useEffect } from 'react';
import { useNavigate } from '../router';
import { Country, Offering } from '../types';
import { api } from '../services/api';
import { ArrowRight, CheckCircle2, Loader2, Sparkles, X, Plus } from 'lucide-react';

export const TargetConfigurator: React.FC = () => {
  const navigate = useNavigate();

  // Data states
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Form states
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('ALL');
  const [selectedOrg, setSelectedOrg] = useState<string>('ALL');
  const [targetRoles, setTargetRoles] = useState<string[]>(['IT leadership']);
  const [roleInput, setRoleInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Search execution states
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState<number>(0);

  const searchSteps = [
    'Mapping organization',
    'Finding contacts',
    'Researching signals',
    'Scoring leads'
  ];

  // Load offerings and countries in parallel on mount
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      setIsLoadingInitial(true);
      try {
        const [offeringList, countryList] = await Promise.all([
          api.getOfferings(),
          api.getCountries()
        ]);
        if (isMounted) {
          setOfferings(offeringList);
          setCountries(countryList);
          // Default select the first offering
          if (offeringList.length > 0) {
            setSelectedOfferingId(offeringList[0].id);
          }
          // Load default organizations
          const orgList = await api.getOrganizations('ALL');
          if (isMounted) {
            setOrganizations(orgList);
          }
        }
      } catch (err) {
        console.error('Failed to load configurator options', err);
      } finally {
        if (isMounted) {
          setIsLoadingInitial(false);
        }
      }
    }

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reload organizations when country changes
  const handleCountryChange = async (newCountryCode: string) => {
    setSelectedCountryCode(newCountryCode);
    setSelectedOrg('ALL');
    try {
      const orgList = await api.getOrganizations(newCountryCode);
      setOrganizations(orgList);
    } catch (err) {
      console.error('Failed to reload organizations', err);
    }
  };

  // Role chip handlers
  const handleAddRole = () => {
    const trimmed = roleInput.trim();
    if (trimmed && !targetRoles.includes(trimmed)) {
      setTargetRoles([...targetRoles, trimmed]);
      setRoleInput('');
    }
  };

  const handleRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRole();
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setTargetRoles(targetRoles.filter((r) => r !== roleToRemove));
  };

  // Submit search
  const handleFindLeads = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOfferingId) {
      setValidationError('Please select an offering to begin discovering leads.');
      return;
    }
    setValidationError(null);

    setIsSearching(true);
    setSearchStep(0);

    // Advance steps every ~600ms
    const interval = setInterval(() => {
      setSearchStep((prev) => {
        if (prev < searchSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 600);

    try {
      const searchResult = await api.createSearch({
        offeringId: selectedOfferingId,
        countryCode: selectedCountryCode === 'ALL' ? undefined : selectedCountryCode,
        organization: selectedOrg === 'ALL' ? undefined : selectedOrg,
        targetRoles
      });

      // Complete all steps before navigating
      setTimeout(() => {
        clearInterval(interval);
        setSearchStep(searchSteps.length);
        setTimeout(() => {
          navigate(`/searches/${searchResult.id}`);
        }, 300);
      }, 2400);
    } catch (err) {
      clearInterval(interval);
      setIsSearching(false);
      console.error('Search failed', err);
      setValidationError('Could not execute search. Please try again.');
    }
  };

  const selectedOffering = offerings.find((o) => o.id === selectedOfferingId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Title & Introduction */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#007BC0]">
            Target Configurator
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-medium">B2B Sales Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Find prospective leads for your service
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Configure your service offering and target organization boundaries. The system maps departmental structures, gathers evidence signals, and ranks relevant contacts for human review.
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {isLoadingInitial ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            <p className="text-xs font-medium text-slate-500">Loading catalog and organizational entities...</p>
          </div>
        ) : (
          <form onSubmit={handleFindLeads} className="space-y-7">
            {/* 1. Offering (Required) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="offering-select" className="block text-sm font-semibold text-slate-800">
                  Offering <span className="text-[#ED0007]">*</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">Required</span>
              </div>
              <select
                id="offering-select"
                value={selectedOfferingId}
                onChange={(e) => {
                  setSelectedOfferingId(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isSearching}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007BC0] focus:border-transparent transition-all"
              >
                <option value="" disabled>
                  Select an offering...
                </option>
                {offerings.map((off) => (
                  <option key={off.id} value={off.id}>
                    {off.name}
                  </option>
                ))}
              </select>

              {/* Offering Description */}
              {selectedOffering && (
                <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Scope & Deliverables: </span>
                  {selectedOffering.description}
                </div>
              )}

              {/* Inline Validation Message */}
              {validationError && (
                <p className="mt-2 text-xs font-semibold text-[#ED0007] flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ED0007]" />
                  {validationError}
                </p>
              )}
            </div>

            {/* 2. Country & Organization Grid (Optional, Defaults to All) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
              {/* Country */}
              <div>
                <label htmlFor="country-select" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Country
                </label>
                <select
                  id="country-select"
                  value={selectedCountryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={isSearching}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007BC0] focus:border-transparent transition-all"
                >
                  <option value="ALL">All countries</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Defaults to All. Selecting a country filters available organizations.
                </p>
              </div>

              {/* Organization */}
              <div>
                <label htmlFor="organization-select" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Organization / Business Unit
                </label>
                <select
                  id="organization-select"
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  disabled={isSearching}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007BC0] focus:border-transparent transition-all"
                >
                  <option value="ALL">All organizations</option>
                  {organizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Optional scope filter across divisions and development hubs.
                </p>
              </div>
            </div>

            {/* 3. Target Roles (Free-text chips) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Target Roles
              </label>
              <p className="text-xs text-slate-500 mb-2.5">
                Specify roles or keywords. Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono text-slate-700">Enter</kbd> to add chips.
              </p>

              {/* Chip list */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {targetRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-md text-xs font-medium"
                  >
                    <span>{role}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      disabled={isSearching}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                      aria-label={`Remove role ${role}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {targetRoles.length === 0 && (
                  <span className="text-xs text-slate-400 italic">
                    No role filters applied (searches all roles)
                  </span>
                )}
              </div>

              {/* Add role input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={handleRoleKeyDown}
                  disabled={isSearching}
                  placeholder="e.g. IT leadership, Head of Engineering, Quality Director..."
                  className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007BC0] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  disabled={!roleInput.trim() || isSearching}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>

            {/* Action / Progress Area */}
            {!isSearching ? (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  Leads and evidence will be calculated transparently.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ED0007] hover:bg-[#d10006] active:bg-[#b00005] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED0007] focus:ring-offset-2"
                >
                  <span>Find leads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Progress Panel */
              <div className="pt-6 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#007BC0]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Searching across organizational sources
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500 font-medium font-mono tabular-nums">
                      {Math.min(searchStep + 1, searchSteps.length)} of {searchSteps.length}
                    </span>
                  </div>

                  {/* 4 Step Progress List */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {searchSteps.map((stepName, idx) => {
                      const isCompleted = idx < searchStep;
                      const isCurrent = idx === searchStep;
                      return (
                        <div
                          key={stepName}
                          className={`p-3 rounded-md border transition-all ${
                            isCompleted
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                              : isCurrent
                              ? 'bg-white border-[#007BC0] shadow-sm text-slate-900'
                              : 'bg-slate-100/60 border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isCurrent ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#007BC0] shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-mono text-slate-400">
                                {idx + 1}
                              </div>
                            )}
                            <span className="text-xs font-semibold">
                              {isCompleted ? 'Done' : isCurrent ? 'In progress' : `Step ${idx + 1}`}
                            </span>
                          </div>
                          <p className="text-xs font-medium leading-tight">
                            {stepName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
