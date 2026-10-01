import React from 'react';
import { Link, useLocation } from '../../router';
import { Search, RotateCcw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { addToast } = useToast();

  const handleResetData = () => {
    api.resetMockData();
    addToast('Demo data reset to initial baseline', 'info');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                LeadGen
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                AI
              </span>
            </Link>

            <span className="hidden md:inline-block h-4 w-px bg-slate-200" />
            <span className="hidden md:inline-block text-xs text-slate-500 font-medium">
              GS/BDO Sales Intelligence
            </span>
          </div>

          {/* Navigation & User */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                location.pathname === '/'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              New search
            </Link>

            <button
              onClick={handleResetData}
              title="Reset demo data to initial state"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              Reset demo
            </button>

            {/* Avatar Demo user */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold"
                aria-label="Demo user profile"
              >
                DU
              </div>
              <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                Demo user
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thin fictional data banner */}
      <div className="bg-slate-50 border-t border-b border-slate-200/80 px-4 py-1 text-center">
        <p className="text-[11px] text-slate-500 font-medium tracking-tight">
          Demo data: all companies, people and sources shown are fictional.
        </p>
      </div>
    </header>
  );
};
