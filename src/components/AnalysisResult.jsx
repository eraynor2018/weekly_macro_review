export default function AnalysisResult({ result }) {
  const { macro, matchCount, matchedIds, analysis, error, errorDetail } = result

  return (
    <div className="rounded border border-border bg-bg-secondary flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-border">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-mono text-sm font-semibold text-text-primary truncate">
            {macro.name}
          </span>
          <span className="font-mono text-xs text-text-muted truncate">
            {macro.body.slice(0, 80)}{macro.body.length > 80 ? '…' : ''}
          </span>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-0.5">
          <span className="font-mono text-lg font-bold text-accent-blue">{matchCount}</span>
          <span className="font-mono text-xs text-text-muted">tickets matched</span>
        </div>
      </div>

      {/* Matched ticket IDs */}
      {matchedIds.length > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <span className="font-mono text-xs text-text-muted">Ticket IDs: </span>
          <span className="font-mono text-xs text-text-secondary">
            {matchedIds.map(id => `#${id}`).join(', ')}
          </span>
        </div>
      )}

      {/* Analysis */}
      <div className="px-4 py-3">
        {error ? (
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs text-red-400">{error}</p>
            {errorDetail && <p className="font-mono text-xs text-red-300/70">{errorDetail}</p>}
          </div>
        ) : analysis ? (
          <pre className="font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
            {analysis}
          </pre>
        ) : matchCount === 0 ? (
          <p className="font-mono text-xs text-text-muted">No matching tickets found in this export.</p>
        ) : (
          <p className="font-mono text-xs text-text-muted">Analyzing…</p>
        )}
      </div>
    </div>
  )
}
