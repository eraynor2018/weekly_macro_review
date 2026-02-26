import { useState, useCallback } from 'react'
import FileDropZone from './components/FileDropZone'
import MacroSelector from './components/MacroSelector'
import AnalysisResult from './components/AnalysisResult'
import { parseMacros } from './utils/parseMacros'
import { parseTickets, findMatchingTickets, condenseTicket } from './utils/parseTickets'

export default function App() {
  const [macros, setMacros] = useState([])
  const [macroFileInfo, setMacroFileInfo] = useState(null)
  const [tickets, setTickets] = useState([])
  const [ticketFileInfo, setTicketFileInfo] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [results, setResults] = useState([])
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(null)
  const [pasteMode, setPasteMode] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const handleMacroLoad = useCallback((text, filename) => {
    const parsed = parseMacros(text)
    if (parsed.length === 0) {
      alert('Could not parse any macros. Check the format (JSON array or pipe-separated).')
      return
    }
    setMacros(parsed)
    setMacroFileInfo(`${filename} — ${parsed.length} macros`)
    setSelected(new Set())
    setResults([])
  }, [])

  const handlePasteSubmit = useCallback(() => {
    handleMacroLoad(pasteText, 'pasted text')
    setPasteMode(false)
  }, [pasteText, handleMacroLoad])

  const handleTicketLoad = useCallback((text, filename) => {
    const parsed = parseTickets(text)
    if (parsed.length === 0) {
      alert('Could not parse any tickets. Ensure the file is NDJSON format (one JSON object per line).')
      return
    }
    setTickets(parsed)
    setTicketFileInfo(`${filename} — ${parsed.length} tickets`)
    setResults([])
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (selected.size === 0) {
      alert('Select at least one macro to analyze.')
      return
    }

    const selectedMacros = [...selected].map(idx => macros[idx])
    setAnalyzing(true)
    setResults([])

    const newResults = []

    for (let i = 0; i < selectedMacros.length; i++) {
      const macro = selectedMacros[i]
      setProgress({ current: i + 1, total: selectedMacros.length, name: macro.name })

      const matched = findMatchingTickets(macro, tickets)
      const matchCount = matched.length

      const resultEntry = {
        macro,
        matchCount,
        matchedIds: matched.map(t => t.id),
        analysis: null,
        error: null,
      }

      if (matchCount === 0) {
        newResults.push(resultEntry)
        setResults([...newResults])
        continue
      }

      const ticketSummaries = matched.map(condenseTicket)

      try {
        const resp = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            macroName: macro.name,
            macroBody: macro.body,
            ticketSummaries,
            matchCount,
          }),
        })

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}))
          resultEntry.error = err.error || `API error ${resp.status}`
        } else {
          const data = await resp.json()
          resultEntry.analysis = data.analysis
        }
      } catch (err) {
        resultEntry.error = `Network error: ${err.message}`
      }

      newResults.push(resultEntry)
      setResults([...newResults])
    }

    setAnalyzing(false)
    setProgress(null)
  }, [selected, macros, tickets])

  const readyToAnalyze = macros.length > 0 && tickets.length > 0 && selected.size > 0

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-mono">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-text-primary">
            Macro Check Analyzer
          </h1>
          <p className="text-xs text-text-muted">
            Weekly macro spike investigation tool — powered by Claude
          </p>
        </div>

        {/* File uploads */}
        <div className="flex flex-col gap-6 p-4 rounded border border-border bg-bg-secondary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <FileDropZone
                label="Macro List"
                accept=".json,.txt"
                onLoad={handleMacroLoad}
                loaded={macros.length > 0}
                fileInfo={macroFileInfo}
              />
              <button
                onClick={() => setPasteMode(v => !v)}
                className="text-xs text-accent-blue hover:text-accent-blue-hover text-left transition-colors"
              >
                {pasteMode ? '↑ Hide paste area' : '↓ Or paste text instead'}
              </button>

              {pasteMode && (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                    placeholder={'JSON array or pipe-separated:\nMacro Name ||| macro body text'}
                    rows={5}
                    className="w-full rounded border border-border bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder-text-muted font-mono resize-y focus:outline-none focus:border-accent-blue"
                  />
                  <button
                    onClick={handlePasteSubmit}
                    disabled={!pasteText.trim()}
                    className="self-start px-3 py-1.5 rounded bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-40 text-xs text-white transition-colors"
                  >
                    Parse macros
                  </button>
                </div>
              )}
            </div>

            <FileDropZone
              label="Zendesk Ticket Export (NDJSON)"
              accept=".ndjson,.jsonl,.json,.txt"
              onLoad={handleTicketLoad}
              loaded={tickets.length > 0}
              fileInfo={ticketFileInfo}
            />
          </div>
        </div>

        {/* Macro selector */}
        {macros.length > 0 && (
          <div className="p-4 rounded border border-border bg-bg-secondary">
            <MacroSelector
              macros={macros}
              selected={selected}
              onChange={setSelected}
            />
          </div>
        )}

        {/* Analyze button + progress */}
        {(macros.length > 0 || tickets.length > 0) && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!readyToAnalyze || analyzing}
              className="px-5 py-2 rounded bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-40 text-sm text-white font-semibold transition-colors"
            >
              {analyzing ? 'Analyzing…' : 'Analyze'}
            </button>

            {analyzing && progress && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-secondary">
                  Processing {progress.current} of {progress.total}
                </span>
                <span className="text-xs text-text-muted truncate max-w-xs">
                  {progress.name}
                </span>
                <div className="h-1 w-48 bg-bg-tertiary rounded overflow-hidden">
                  <div
                    className="h-full bg-accent-blue transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {!readyToAnalyze && !analyzing && (
              <span className="text-xs text-text-muted">
                {macros.length === 0 && 'Load macros · '}
                {tickets.length === 0 && 'Load tickets · '}
                {macros.length > 0 && tickets.length > 0 && selected.size === 0 && 'Select macros · '}
                required to analyze
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-text-secondary">
              Results — {results.length} macro{results.length !== 1 ? 's' : ''}
            </span>
            {results.map((result, idx) => (
              <AnalysisResult key={idx} result={result} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
