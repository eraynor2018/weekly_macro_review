import { useState } from 'react'

export default function MacroSelector({ macros, selected, onChange }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? macros
        .map((macro, idx) => ({ macro, idx }))
        .filter(({ macro }) => macro.name.toLowerCase().includes(query.toLowerCase()))
    : macros.map((macro, idx) => ({ macro, idx }))

  const allFilteredSelected = filtered.length > 0 && filtered.every(({ idx }) => selected.has(idx))

  const toggleFiltered = () => {
    const next = new Set(selected)
    if (allFilteredSelected) {
      filtered.forEach(({ idx }) => next.delete(idx))
    } else {
      filtered.forEach(({ idx }) => next.add(idx))
    }
    onChange(next)
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
          {selected.size > 0 && (
            <span className="text-accent-blue"> · {selected.size} selected</span>
          )}
        </span>
        <button
          onClick={toggleFiltered}
          className="text-xs font-mono text-accent-blue hover:text-accent-blue-hover transition-colors"
        >
          {allFilteredSelected ? 'Deselect all' : 'Select all'}
          {query.trim() ? ' filtered' : ''}
        </button>
      </div>

      {/* Search box */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter macros by name…"
        className="w-full rounded border border-border bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder-text-muted font-mono focus:outline-none focus:border-accent-blue"
      />

      {/* Filtered count hint */}
      {query.trim() && (
        <span className="text-xs text-text-muted font-mono">
          {filtered.length} of {macros.length} match
        </span>
      )}

      <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
        {filtered.map(({ macro, idx }) => (
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

        {filtered.length === 0 && query.trim() && (
          <p className="text-sm text-text-muted font-mono text-center py-4">
            No macros match "{query}"
          </p>
        )}
      </div>

      {macros.length === 0 && (
        <p className="text-sm text-text-muted font-mono text-center py-4">
          No macros loaded yet
        </p>
      )}
    </div>
  )
}
