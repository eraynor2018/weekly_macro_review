import { AnalysisResult } from '@/types';

interface SummaryCardsProps {
  results: AnalysisResult[];
}

export default function SummaryCards({ results }: SummaryCardsProps) {
  const totalTickets = new Set(
    results.flatMap((r) => [
      ...r.reasons.flatMap((reason) => reason.ticket_ids),
      ...r.action_items.map((a) => a.ticket_id),
      ...r.needs_context.map((n) => n.ticket_id),
    ])
  ).size;

  const totalActionItems = results.reduce((sum, r) => sum + r.action_items.length, 0);
  const totalNeedsContext = results.reduce((sum, r) => sum + r.needs_context.length, 0);

  const cards = [
    { label: 'Tickets Reviewed', value: totalTickets, color: 'text-blue-400' },
    { label: 'Macros Reviewed', value: results.length, color: 'text-slate-300' },
    { label: 'Action Items', value: totalActionItems, color: 'text-red-400' },
    { label: 'Needs Manual Review', value: totalNeedsContext, color: 'text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center"
        >
          <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-xs text-slate-400 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
