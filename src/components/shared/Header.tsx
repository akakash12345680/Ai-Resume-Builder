import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">ResumeAI</span>
        </Link>
        <nav className="flex flex-1 items-center gap-4 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Log in</Button>
          <Link href="/build">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
