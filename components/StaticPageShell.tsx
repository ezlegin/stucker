import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StaticPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-svh overflow-x-hidden">
      <AmbientBackground />

      <header className="sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BookOpen className="size-4" />
            </div>
            <span className="tracking-tight">Stucker</span>
          </Link>

          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back home
            </Link>
          </Button>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 pt-12 pb-24 md:pt-20 md:pb-32">
        {children}
      </article>
    </main>
  );
}

function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-muted/20" />

      <div className="absolute -top-40 -left-40 size-120 rounded-full bg-chart-1/20 blur-3xl" />
      <div className="absolute top-1/3 -right-40 size-120 rounded-full bg-chart-3/15 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 size-112 rounded-full bg-chart-2/15 blur-3xl" />
    </div>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:tracking-tight [&_p]:text-pretty [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:leading-relaxed [&_strong]:text-foreground [&_strong]:font-medium">
      {children}
    </div>
  );
}
