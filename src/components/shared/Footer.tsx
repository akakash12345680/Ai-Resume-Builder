import Link from 'next/link';
import { Logo } from '@/components/icons';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex items-center justify-between px-4 py-6 md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <p className="text-sm font-semibold">ResumeAI</p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
