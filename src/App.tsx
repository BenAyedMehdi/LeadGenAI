import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from './router';
import { ToastProvider } from './context/ToastContext';
import { TopBar } from './components/layout/TopBar';
import { TargetConfigurator } from './pages/TargetConfigurator';
import { SearchResults } from './pages/SearchResults';
import { LeadCard } from './pages/LeadCard';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F5F6F7]">
          <TopBar />
          <div className="flex-1 pb-16">
            <Routes>
              {/* 1. Target Configurator */}
              <Route path="/" element={<TargetConfigurator />} />

              {/* 2. Search Results */}
              <Route path="/searches/:id" element={<SearchResults />} />

              {/* 3. Lead Card */}
              <Route path="/leads/:id" element={<LeadCard />} />

              {/* 4. Not Found Fallback */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
