import { useState, useRef, useCallback } from 'react'

export default function FileDropZone({ label, accept, onLoad, loaded, fileInfo }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const readFile = useCallback((file) => {
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        onLoad(e.target.result, file.name)
      } catch (err) {
        setError(err.message)
      }
    }
    reader.onerror = () => setError('Failed to read file')
    reader.readAsText(file)
  }, [onLoad])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) readFile(file)
  }, [readFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }, [readFile])

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">{label}</span>
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded border-2 border-dashed px-4 py-6 text-center transition-colors
          ${dragging
            ? 'border-accent-blue bg-accent-blue/10'
            : loaded
              ? 'border-green-700 bg-green-900/10'
              : 'border-border hover:border-border-light hover:bg-bg-tertiary'
          }
        `}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileInput}
        />

        {loaded ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-green-400 text-lg">✓</span>
            <span className="font-mono text-sm text-green-400">{fileInfo}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl text-text-muted">↑</span>
            <span className="text-sm text-text-secondary">
              Drop file here or <span className="text-accent-blue underline">browse</span>
            </span>
            <span className="text-xs text-text-muted">{accept}</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 font-mono">{error}</p>
      )}
    </div>
  )
}
