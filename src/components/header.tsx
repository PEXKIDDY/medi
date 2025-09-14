"use client";
import Link from 'next/link';
import { HeartPulse, Bot, Bell, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-md">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <HeartPulse className="h-8 w-8" />
        <h1 className="text-2xl font-bold">MEDI-CARE</h1>
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/ai"
          className="flex items-center gap-2 text-lg font-medium hover:underline"
          prefetch={false}
        >
          <Bot className="h-6 w-6" />
          <span>AI</span>
        </Link>
        <Link
          href="/reminders"
          className="flex items-center gap-2 text-lg font-medium hover:underline"
          prefetch={false}
        >
          <Bell className="h-6 w-6" />
          <span>Reminders</span>
        </Link>
        <Link
            href="/medi-info"
            className="flex items-center gap-2 text-lg font-medium hover:underline"
            prefetch={false}
        >
            <Search className="h-6 w-6" />
            <span>Medi-Info</span>
        </Link>
      </nav>
    </header>
  );
}
