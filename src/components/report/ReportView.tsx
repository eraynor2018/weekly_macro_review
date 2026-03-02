'use client';

import { useApp } from '@/context/AppContext';
import SummaryCards from './SummaryCards';
import ActionItemsSection from './ActionItemsSection';
import NeedsReviewSection from './NeedsReviewSection';
import MacroBreakdown from './MacroBreakdown';
import CopyReportButton from './CopyReportButton';
import Button from '@/components/ui/Button';

interface ReportViewProps {
  onReset: () => void;
}

export default function ReportView({ onReset }: ReportViewProps) {
  const { reportState, updateTrendNote } = useApp();

  if (!reportState || reportState.results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No report data available.</p>
        <Button variant="secondary" onClick={onReset} className="mt-4">
          Start Over
        </Button>
      </div>
    );
  }

  const { results, editedTrendNotes } = reportState;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">Report</h2>
        <div className="flex gap-3">
          <CopyReportButton results={results} editedTrendNotes={editedTrendNotes} />
          <Button variant="secondary" onClick={onReset}>
            New Session
          </Button>
        </div>
      </div>

      <SummaryCards results={results} />
      <ActionItemsSection results={results} />
      <NeedsReviewSection results={results} />

      <section>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Per-Macro Breakdown</h2>
        {results.map((result) => (
          <MacroBreakdown
            key={result.macroTitle}
            result={result}
            editedTrendNote={editedTrendNotes[result.macroTitle]}
            onUpdateTrendNote={(note) => updateTrendNote(result.macroTitle, note)}
          />
        ))}
      </section>
    </div>
  );
}
