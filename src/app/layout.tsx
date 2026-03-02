import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import NavTabs from '@/components/layout/NavTabs';

export const metadata: Metadata = {
  title: 'Macro Review Tool',
  description: 'Internal tool for reviewing Zendesk macro usage',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="min-h-screen bg-slate-900">
            <NavTabs />
            <main className="max-w-6xl mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
