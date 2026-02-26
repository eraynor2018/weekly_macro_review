export default function MacroSelector({ macros, selected, onChange }) {
  const allSelected = macros.length > 0 && selected.size === macros.length

  const toggleAll = () => {
    if (allSelected) {
      onChange(new Set())
    } else {
      onChange(new Set(macros.map((_, i) => i)))
    }
  }

  const toggleOne = (idx) => {
    const next = new Set(selected)
    if (next.has(idx)) {
      next.delete(idx)
    } else {
      next.add(idx)
    }
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">
          Macros — {macros.length} loaded
        </span>
        <button
          onClick={toggleAll}
          className="text-xs font-mono text-accent-blue hover:text-accent-blue-hover transition-colors"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
        {macros.map((macro, idx) => (
          <label
            key={idx}
            className={`
              flex items-start gap-3 rounded px-3 py-2 cursor-pointer transition-colors
              ${selected.has(idx)
                ? 'bg-accent-blue/10 border border-accent-blue/30'
                : 'bg-bg-tertiary border border-transparent hover:border-border-light'
              }
            `}
          >
            <input
              type="checkbox"
              checked={selected.has(idx)}
              onChange={() => toggleOne(idx)}
              className="mt-0.5 accent-accent-blue shrink-0"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-sm text-text-primary truncate">{macro.name}</span>
              <span className="font-mono text-xs text-text-muted truncate">
                {macro.body.slice(0, 100)}{macro.body.length > 100 ? '…' : ''}
              </span>
            </div>
          </label>
        ))}
      </div>

      {macros.length === 0 && (
        <p className="text-sm text-text-muted font-mono text-center py-4">
          No macros loaded yet
        </p>
      )}
    </div>
  )
}
