import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Welcome to Medi-OSINT</h1>
            <p className="mt-4 text-lg text-muted-foreground">Your friendly health companion.</p>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Medi-OSINT. For informational purposes only. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
}
