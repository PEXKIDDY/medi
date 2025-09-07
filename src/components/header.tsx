import Link from 'next/link';
import { Stethoscope, Workflow } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary-foreground bg-primary p-1.5 rounded-lg" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Medi-OSINT
            </h1>
          </Link>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/osint-framework">
                <Workflow className="mr-2 h-4 w-4" />
                OSINT Framework
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
