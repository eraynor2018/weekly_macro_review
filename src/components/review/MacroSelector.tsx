'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { stripHtml } from '@/lib/matching';

interface MacroSelectorProps {
  onNext: () => void;
  onBack: () => void;
}

export default function MacroSelector({ onNext, onBack }: MacroSelectorProps) {
  const { macros, selectedMacroIds, toggleMacroSelection, selectAllMacros, clearMacroSelection } =
    useApp();
  const [search, setSearch] = useState('');

  const filtered = search
    ? macros.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.body.toLowerCase().includes(search.toLowerCase())
      )
    : macros;

  if (macros.length === 0) {
    return (
      <Card variant="amber">
        <p className="text-amber-300 text-sm">
          No macros in library. Go to the <strong>Macro Library</strong> tab first.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {selectedMacroIds.size} of {macros.length} selected
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={selectAllMacros}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={clearMacroSelection}>
            Deselect All
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search macros..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1">
        {filtered.map((macro) => {
          const isSelected = selectedMacroIds.has(macro.id);
          return (
            <label
              key={macro.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-950 border-blue-700'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleMacroSelection(macro.id)}
                className="mt-0.5 accent-blue-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{macro.title}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5 font-mono">
                  {stripHtml(macro.body).slice(0, 100)}
                </p>
              </div>
            </label>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            No macros match your search.
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={onNext} disabled={selectedMacroIds.size === 0}>
          Match Tickets →
        </Button>
      </div>
    </div>
  );
}
