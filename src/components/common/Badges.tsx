import React from 'react';
import { ConfidenceLevel, CriterionRating, LeadStatus, RoleType } from '../../types';
import { calculateFreshness } from '../../utils/dateFreshness';
import { Clock, AlertTriangle } from 'lucide-react';

export const MockPill: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-300 select-none ${className}`}
      title="Fictional mock data for demonstration"
    >
      MOCK
    </span>
  );
};

export const StatusChip: React.FC<{ status: LeadStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-300 ${className}`}
        >
          APPROVED
        </span>
      );
    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-red-50 text-[#ED0007] border border-red-200 ${className}`}
        >
          REJECTED
        </span>
      );
    case 'NEW':
    default:
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
        >
          NEW
        </span>
      );
  }
};

export const ConfidenceBadge: React.FC<{ confidence: ConfidenceLevel; className?: string }> = ({
  confidence,
  className = ''
}) => {
  switch (confidence) {
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}
          title="Confidence: High organizational alignment factors"
        >
          High confidence
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
          title="Confidence: Medium"
        >
          Medium confidence
        </span>
      );
    case 'LOW':
    default:
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
          title="Confidence: Low"
        >
          Low confidence
        </span>
      );
  }
};

export const RoleTag: React.FC<{ role: RoleType; className?: string }> = ({ role, className = '' }) => {
  if (role === 'Decision maker') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 text-white ${className}`}
      >
        Decision maker
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-sky-50 text-[#007BC0] border border-sky-200 ${className}`}
    >
      Technical contact
    </span>
  );
};

export const FreshnessBadge: React.FC<{ dateString: string; className?: string }> = ({ dateString, className = '' }) => {
  const freshness = calculateFreshness(dateString);

  if (freshness.level === 'green') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        title={`Updated on ${dateString} (within 3 months of 2026-10-01)`}
      >
        <Clock className="w-3 h-3 text-emerald-600" />
        {freshness.text}
      </span>
    );
  }

  if (freshness.level === 'amber') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        title={`Updated on ${dateString} (3 to 6 months before 2026-10-01)`}
      >
        <Clock className="w-3 h-3 text-amber-600" />
        {freshness.text}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-[#ED0007] border border-red-200 ${className}`}
      title={`Updated on ${dateString} (over 6 months before 2026-10-01)`}
    >
      <Clock className="w-3 h-3 text-[#ED0007]" />
      {freshness.text}
    </span>
  );
};

export const LowEvidenceWarning: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 ${className}`}
    >
      <AlertTriangle className="w-3 h-3 text-amber-600" />
      Low evidence
    </span>
  );
};

export const CriterionRatingBadge: React.FC<{ rating: CriterionRating }> = ({ rating }) => {
  switch (rating) {
    case 'HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
          LOW
        </span>
      );
  }
};
