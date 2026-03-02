'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/library', label: 'Macro Library' },
  { href: '/review', label: 'Review Session' },
  { href: '/settings', label: 'Settings' },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-sm font-semibold mr-4 py-3">
            Macro Review Tool
          </span>
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
