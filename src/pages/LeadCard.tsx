import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '../router';
import { LeadDetail, OutreachDraft } from '../types';
import { api } from '../services/api';
import {
  MockPill,
  StatusChip,
  ConfidenceBadge,
  RoleTag,
  FreshnessBadge,
  LowEvidenceWarning,
  CriterionRatingBadge
} from '../components/common/Badges';
import { LeadDetailSkeleton } from '../components/common/Skeletons';
import { useToast } from '../context/ToastContext';
import {
  ChevronLeft,
  Users,
  CheckCircle,
  XCircle,
  Copy,
  Save,
  RotateCw,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const LeadCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Rejection modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionComment, setRejectionComment] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Outreach draft editing state
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Fetch lead details on mount or ID change
  useEffect(() => {
    let isMounted = true;
    async function loadLead() {
      setIsLoading(true);
      try {
        const data = await api.getLead(id || '');
        if (!isMounted) return;
        if (!data) {
          setNotFound(true);
        } else {
          setLead(data);
          if (data.outreach) {
            setDraftSubject(data.outreach.subject);
            setDraftBody(data.outreach.body);
          }
        }
      } catch (err) {
        console.error('Failed to load lead details', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLead();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Action: Approve Lead
  const handleApprove = async () => {
    if (!lead) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateLeadStatus(lead.id, 'APPROVED');
      setLead(updated);
      addToast(`${lead.name} approved successfully`, 'success');
    } catch (err) {
      console.error('Failed to approve lead', err);
      addToast('Failed to approve lead. Please try again.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Action: Reject Lead (via modal)
  const handleConfirmReject = async () => {
    if (!lead) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateLeadStatus(lead.id, 'REJECTED', rejectionComment);
      setLead(updated);
      setIsRejectModalOpen(false);
      setRejectionComment('');
      addToast(`${lead.name} marked as Rejected`, 'error');
    } catch (err) {
      console.error('Failed to reject lead', err);
      addToast('Failed to reject lead. Please try again.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Action: Generate First Contact Draft (1.5s fake loading)
  const handleGenerateOutreach = async () => {
    if (!lead) return;
    setIsGeneratingOutreach(true);
    try {
      const draft = await api.generateOutreach(lead.id);
      setLead((prev) => (prev ? { ...prev, outreach: draft } : prev));
      setDraftSubject(draft.subject);
      setDraftBody(draft.body);
      addToast('First contact email draft generated', 'info');
    } catch (err) {
      console.error('Failed to generate draft', err);
      addToast('Draft generation failed. Please try again.', 'error');
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  // Action: Save Edits to Draft
  const handleSaveDraft = async () => {
    if (!lead || !lead.outreach) return;
    setIsSavingDraft(true);
    try {
      const updatedDraft: OutreachDraft = {
        ...lead.outreach,
        subject: draftSubject,
        body: draftBody
      };
      const result = await api.saveOutreach(lead.id, updatedDraft);
      setLead((prev) => (prev ? { ...prev, outreach: result } : prev));
      addToast('Draft edits saved', 'success');
    } catch (err) {
      console.error('Failed to save draft', err);
      addToast('Failed to save draft edits.', 'error');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Action: Copy Draft to Clipboard
  const handleCopyToClipboard = async () => {
    const fullText = `Subject: ${draftSubject}\n\n${draftBody}`;
    try {
      await navigator.clipboard.writeText(fullText);
      addToast('Draft copied to clipboard', 'success');
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      addToast('Draft copied to clipboard', 'success');
    }
  };

  if (isLoading) {
    return <LeadDetailSkeleton />;
  }

  if (notFound || !lead) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Lead not found</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            The lead identifier <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">{id}</code> was not found in the current search repository.
          </p>
          <Link
            to="/searches/s-001"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED0007] text-white text-xs font-semibold rounded-lg hover:bg-[#d10006] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to search results</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb / Return Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/searches/s-001"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to ranked leads</span>
        </Link>

        {/* Lead action buttons in top bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRejectModalOpen(true)}
            disabled={isUpdatingStatus}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              lead.status === 'REJECTED'
                ? 'bg-red-50 text-[#ED0007] border-red-200'
                : 'bg-white hover:bg-red-50 text-slate-700 hover:text-[#ED0007] border-slate-300 hover:border-red-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-[#ED0007]" />
            <span>{lead.status === 'REJECTED' ? 'Rejected' : 'Reject lead'}</span>
          </button>

          <button
            onClick={handleApprove}
            disabled={isUpdatingStatus}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              lead.status === 'APPROVED'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{lead.status === 'APPROVED' ? 'Approved' : 'Approve lead'}</span>
          </button>
        </div>
      </div>

      {/* 1. HERO HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Contact Info, Badges, Team Context */}
          <div className="space-y-3 max-w-2xl">
            {/* Badges line */}
            <div className="flex flex-wrap items-center gap-2">
              <RoleTag role={lead.roleType} />
              {lead.isMock && <MockPill />}
              <ConfidenceBadge confidence={lead.confidence} />
              <StatusChip status={lead.status} />
            </div>

            {/* Name & Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {lead.name}
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-600 mt-0.5">
                {lead.title}
              </p>
            </div>

            {/* Location & Team context */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1">
              <div>
                <span className="font-semibold text-slate-700">Unit:</span> {lead.orgUnit} ({lead.city})
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Team size: <strong className="text-slate-700 font-mono">{lead.teamContext.teamSize}</strong></span>
              </div>
              <span className="text-slate-300">·</span>
              <div>
                <span>Reports to: <strong className="text-slate-700">{lead.teamContext.reportsTo}</strong></span>
              </div>
            </div>

            {/* If Rejected: Rejection comment notification */}
            {lead.status === 'REJECTED' && lead.rejectionComment && (
              <div className="mt-2 p-2.5 rounded-lg bg-red-50/70 border border-red-200 text-xs text-[#ED0007]">
                <strong>Rejection feedback:</strong> {lead.rejectionComment}
              </div>
            )}
          </div>

          {/* Right: Big Score Box */}
          <div
            className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl min-w-[180px] shrink-0"
            title="Prioritization score, not a probability of sale"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Prioritization Score
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-4xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                {lead.score}
              </span>
              <span className="text-sm font-semibold text-slate-400 font-mono">/ 100</span>
            </div>
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1.5 ${
                lead.score >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : lead.score >= 60
                  ? 'bg-sky-100 text-[#007BC0]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {lead.scoreLabel}
            </span>
            <span className="text-[10px] text-slate-400 mt-2 text-center">
              Relative organizational alignment
            </span>
          </div>
        </div>

        {/* 2. "Why this lead" Callout */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="bg-sky-50/60 border border-sky-200/80 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-[#007BC0] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#007BC0] mb-1">
                  Why this lead
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {lead.whyThisLead}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Evidence & Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Evidence & Outreach (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3. EVIDENCE SECTION */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#007BC0]" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Evidence & Signals ({lead.signals.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Transparent verification
              </span>
            </div>

            {/* List of Signals */}
            <div className="space-y-5">
              {lead.signals.map((signal, sIdx) => {
                return (
                  <div
                    key={signal.id}
                    className="p-4 rounded-lg bg-slate-50/60 border border-slate-200 space-y-3"
                  >
                    {/* Signal Index & Service Match */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        Signal {sIdx + 1}
                      </span>
                      {/* SERVICE MATCH (colored tag) */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 text-[#007BC0] border border-sky-200">
                        {signal.serviceMatch}
                      </span>
                    </div>

                    {/* FACT (neutral prose) */}
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Fact
                      </span>
                      <p className="text-sm text-slate-800 leading-relaxed font-normal bg-white p-2.5 rounded border border-slate-200/80">
                        {signal.fact}
                      </p>
                    </div>

                    {/* AI HYPOTHESIS (italic with distinct label) */}
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                        AI Hypothesis
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed italic bg-indigo-50/40 p-2.5 rounded border border-indigo-100">
                        "{signal.hypothesis}"
                      </p>
                    </div>

                    {/* OPEN QUESTION (question-mark icon) */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Open Question</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-amber-50/50 p-2.5 rounded border border-amber-200/60">
                        {signal.openQuestion}
                      </p>
                    </div>

                    {/* Source Line with Freshness & Mock pill */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {signal.source ? (
                        <div className="flex flex-wrap items-center gap-2 text-slate-600">
                          <span className="text-slate-400">Source:</span>
                          <strong className="text-slate-700">{signal.source.name}</strong>
                          {signal.source.isMock && <MockPill />}
                          <FreshnessBadge dateString={signal.source.lastUpdated} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Source:</span>
                          <span className="text-slate-400 italic">No formal source logged</span>
                          <LowEvidenceWarning />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 7. OUTREACH PANEL (Inline, below) */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#007BC0]" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Outreach Draft
                </h2>
              </div>
              {lead.outreach && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {lead.outreach.generatedBy}
                </span>
              )}
            </div>

            {/* Banner: Draft only: nothing is sent automatically */}
            <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center gap-2.5 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Draft only:</strong> nothing is sent automatically. You always review, edit, and send through your standard email client.
              </span>
            </div>

            {/* If outreach is null: show generate button */}
            {!lead.outreach ? (
              <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 p-6">
                <p className="text-xs text-slate-600 mb-4 max-w-md mx-auto">
                  No first-contact email draft has been generated yet for {lead.name}. Create a personalized message tailored to this lead's specific evidence signals.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateOutreach}
                  disabled={isGeneratingOutreach}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED0007] hover:bg-[#d10006] active:bg-[#b00005] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {isGeneratingOutreach ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating first contact (AI)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate first contact</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Editable Draft Form */
              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label htmlFor="draft-subject" className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    id="draft-subject"
                    type="text"
                    value={draftSubject}
                    onChange={(e) => setDraftSubject(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#007BC0] focus:border-transparent transition-all"
                  />
                </div>

                {/* Body */}
                <div>
                  <label htmlFor="draft-body" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Body
                  </label>
                  <textarea
                    id="draft-body"
                    rows={6}
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#007BC0] focus:border-transparent transition-all font-sans"
                  />
                </div>

                {/* Draft Actions: Save edits, Copy to clipboard, Regenerate (DO NOT ADD SEND BUTTON) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={isSavingDraft}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingDraft ? 'Saving...' : 'Save edits'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyToClipboard}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy to clipboard</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateOutreach}
                    disabled={isGeneratingOutreach}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#007BC0] hover:text-[#005f96] hover:underline"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isGeneratingOutreach ? 'animate-spin' : ''}`} />
                    <span>Regenerate draft</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Score Breakdown, Discovery Questions, Recommended Approach (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 4. SCORE BREAKDOWN (Always visible, 7 rows) */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Score Breakdown
              </h2>
              <span className="text-[11px] font-mono text-slate-500 font-semibold tabular-nums">
                {lead.score} / 100 pts
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {lead.scoreCriteria.map((c) => (
                <div key={c.criterion} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{c.criterion}</span>
                    <div className="flex items-center gap-2">
                      <CriterionRatingBadge rating={c.rating} />
                      <span className="font-mono text-xs font-bold text-slate-700 tabular-nums">
                        {c.points}/{c.maxPoints}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {c.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. DISCOVERY QUESTIONS (Numbered list, max 3) */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 mb-3 border-b border-slate-100">
              Discovery Questions (Max 3)
            </h2>
            <ol className="space-y-2.5 text-xs text-slate-700">
              {lead.discoveryQuestions.slice(0, 3).map((q, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 6. RECOMMENDED APPROACH INFO BOX */}
          <section className="bg-[#007BC0]/5 border border-[#007BC0]/20 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-[#007BC0] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#007BC0] mb-1.5">
                  Recommended Approach
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {lead.recommendedApproach}
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#007BC0]/15 flex items-center justify-between text-[11px] text-[#007BC0] font-semibold">
                  <span>Discovery first, not a pitch</span>
                  <span>Listen 80% · Talk 20%</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Reject Lead Modal with Optional Comment */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-[#ED0007] flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reject {lead.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Mark this contact as rejected for the current offering.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="rejection-comment" className="block text-xs font-semibold text-slate-700 mb-1">
                Optional comment / reason
              </label>
              <textarea
                id="rejection-comment"
                rows={3}
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                placeholder="e.g. Tool already standardized, contact in transition, or budget owned elsewhere..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ED0007] focus:border-transparent transition-all font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isUpdatingStatus}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#ED0007] hover:bg-[#d10006] rounded-lg transition-colors"
              >
                {isUpdatingStatus ? 'Rejecting...' : 'Confirm rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
