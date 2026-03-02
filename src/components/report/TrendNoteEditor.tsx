'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface TrendNoteEditorProps {
  macroTitle: string;
  value: string;
  onSave: (text: string) => void;
}

export default function TrendNoteEditor({ value, onSave }: TrendNoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleSave() {
    onSave(draft);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(value);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="bg-purple-950 border border-purple-700 rounded-lg p-3 mt-2">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="w-full bg-purple-900 border border-purple-600 rounded px-2 py-1.5 text-slate-100 text-sm focus:outline-none focus:border-purple-400 resize-y"
        />
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={handleSave}>Save</Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-950 border border-purple-800 rounded-lg p-3 mt-2 flex items-start gap-2">
      <p className="text-purple-200 text-sm flex-1 italic">{value}</p>
      <button
        onClick={() => { setDraft(value); setIsEditing(true); }}
        className="text-purple-400 hover:text-purple-200 transition-colors flex-shrink-0 mt-0.5"
        title="Edit trend note"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
    </div>
  );
}
