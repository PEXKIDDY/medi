"use client";

import { Header } from '@/components/header';
import { OsintGraph } from '@/components/osint-graph';

export default function OsintFrameworkPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="text-center p-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">OSINT Framework</h1>
        </div>
        <div className="flex-1 w-full h-full">
          <OsintGraph />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Medi-OSINT. For informational purposes only. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
}
