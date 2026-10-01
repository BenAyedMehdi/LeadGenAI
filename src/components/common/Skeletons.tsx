import React from 'react';

export const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-7 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-5 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
          <div className="h-8 bg-slate-100 rounded w-full" />
          <div className="h-8 bg-slate-100 rounded w-full" />
          <div className="h-8 bg-slate-100 rounded w-full" />
        </div>
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-5 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-md p-3 flex justify-between items-center">
              <div className="space-y-2 w-2/3">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
              <div className="h-6 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LeadDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      {/* Back button skeleton */}
      <div className="h-4 bg-slate-200 rounded w-28" />

      {/* Hero header skeleton */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3 w-full md:w-2/3">
          <div className="flex gap-2">
            <div className="h-5 bg-slate-200 rounded w-20" />
            <div className="h-5 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="h-24 bg-slate-100 rounded-lg w-full md:w-48" />
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <div className="h-5 bg-slate-200 rounded w-1/4" />
            <div className="h-24 bg-slate-50 rounded" />
            <div className="h-24 bg-slate-50 rounded" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-6 bg-slate-100 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
