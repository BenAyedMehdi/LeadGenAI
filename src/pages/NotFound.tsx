import React from 'react';
import { Link } from '../router';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-xl border border-slate-200 p-10 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">404 - Page not found</h1>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          The requested path does not exist in LeadGen AI.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED0007] text-white text-xs font-semibold rounded-lg hover:bg-[#d10006] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Target Configurator</span>
        </Link>
      </div>
    </div>
  );
};
