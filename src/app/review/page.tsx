'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import PageShell from '@/components/layout/PageShell';
import TicketUploader from '@/components/review/TicketUploader';
import MacroSelector from '@/components/review/MacroSelector';
import MatchingSummary from '@/components/review/MatchingSummary';
import AnalysisRunner from '@/components/review/AnalysisRunner';
import ReportView from '@/components/report/ReportView';
import Button from '@/components/ui/Button';

const STEPS = [
  'Upload Tickets',
  'Select Macros',
  'Match Tickets',
  'AI Analysis',
];

export default function ReviewPage() {
  const { resetSession, reportState } = useApp();
  const [step, setStep] = useState(0);

  function handleReset() {
    resetSession();
    setStep(0);
  }

  const isReport = step === 4;

  return (
    <PageShell
      title="Review Session"
      description="Upload tickets, select macros, and generate an AI-powered usage report."
    >
      {reportState && step === 0 && (
        <div className="mb-6 flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-sm text-slate-300">You have a report from this session.</p>
          <Button size="sm" variant="secondary" onClick={() => setStep(4)}>
            View Report
          </Button>
        </div>
      )}

      {!isReport && (
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border-2 transition-colors ${
                  i < step
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : i === step
                    ? 'border-blue-500 text-blue-400'
                    : 'border-slate-600 text-slate-600'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  i === step ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-slate-700 mx-1" />}
            </div>
          ))}
        </div>
      )}

      {step === 0 && <TicketUploader onNext={() => setStep(1)} />}
      {step === 1 && <MacroSelector onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <MatchingSummary onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <AnalysisRunner onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <ReportView onReset={handleReset} />}
    </PageShell>
  );
}
