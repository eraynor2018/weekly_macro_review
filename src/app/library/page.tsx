'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import PageShell from '@/components/layout/PageShell';
import CsvImporter from '@/components/library/CsvImporter';
import AddMacroForm from '@/components/library/AddMacroForm';
import MacroTable from '@/components/library/MacroTable';
import Input from '@/components/ui/Input';

export default function LibraryPage() {
  const { macros, deleteMacro, searchMacros } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMacros = searchQuery ? searchMacros(searchQuery) : macros;

  return (
    <PageShell
      title="Macro Library"
      description="Manage the macros used in review sessions."
    >
      <CsvImporter />
      <AddMacroForm />

      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search macros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="text-sm text-slate-400 ml-4">
          {filteredMacros.length} of {macros.length} macro{macros.length !== 1 ? 's' : ''}
        </span>
      </div>

      <MacroTable macros={filteredMacros} onDelete={deleteMacro} />
    </PageShell>
  );
}
