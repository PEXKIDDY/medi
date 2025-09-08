"use client";
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-md">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <HeartPulse className="h-8 w-8" />
        <h1 className="text-2xl font-bold">MEDI-CARE</h1>
      </Link>
    </header>
  );
}
