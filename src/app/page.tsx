import { Header } from '@/components/header';
import { SymptomChecker } from '@/components/symptom-checker';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <SymptomChecker />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Medi-OSINT. For informational purposes only. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
}
