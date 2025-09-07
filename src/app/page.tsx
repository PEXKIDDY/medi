import { Header } from '@/components/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Welcome to Medi-OSINT</h1>
            <p className="mt-4 text-lg text-muted-foreground">An AI-powered tool to find over-the-counter remedies for your symptoms.</p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/symptom-checker">
                  Go to Symptom Checker
                </Link>
              </Button>
            </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Medi-OSINT. For informational purposes only. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
}
