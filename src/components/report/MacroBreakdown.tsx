import { AnalysisResult } from '@/types';
import TrendNoteEditor from './TrendNoteEditor';

interface MacroBreakdownProps {
  result: AnalysisResult;
  editedTrendNote?: string;
  onUpdateTrendNote: (note: string) => void;
}

const ZENDESK_BASE = 'https://sidelineswap.zendesk.com/agent/tickets';

export default function MacroBreakdown({
  result,
  editedTrendNote,
  onUpdateTrendNote,
}: MacroBreakdownProps) {
  const totalTickets = result.reasons.reduce((sum, r) => sum + r.count, 0);
  const trendNote = editedTrendNote ?? result.trend_note;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 mb-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-slate-100 font-semibold">{result.macroTitle}</h3>
        <span className="text-sm text-slate-400">
          {totalTickets} ticket{totalTickets !== 1 ? 's' : ''}
        </span>
      </div>

      <TrendNoteEditor
        macroTitle={result.macroTitle}
        value={trendNote}
        onSave={onUpdateTrendNote}
      />

      {result.reasons.length > 0 && (
        <div className="mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="pb-2 font-medium">Reason</th>
                <th className="pb-2 font-medium text-center w-16">Count</th>
                <th className="pb-2 font-medium">Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {result.reasons.map((reason, i) => (
                <tr key={i}>
                  <td className="py-2.5 text-slate-200 pr-4">{reason.label}</td>
                  <td className="py-2.5 text-center text-blue-400 font-medium">{reason.count}</td>
                  <td className="py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {reason.ticket_ids.map((id) => (
                        <a
                          key={id}
                          href={`${ZENDESK_BASE}/${id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs underline underline-offset-2"
                        >
                          #{id}
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
