import {
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  Lock,
  Mail,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

const CREATOR_EMAIL = "ezlegini.ir@gmail.com";

export default async function HomePage() {
  return (
    <main className="relative overflow-x-hidden">
      <AmbientBackground />
      <Nav />
      <Hero />
      <Preview />
      <Features />
      <FreeForever />
      <Footer />
    </main>
  );
}

/* ------------------------------------------------------------- */
/* Ambient background                                            */
/* ------------------------------------------------------------- */

function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-muted/30" />

      <div className="absolute -top-48 -left-40 size-136 rounded-full bg-chart-1/25 blur-3xl" />
      <div className="absolute top-1/3 -right-40 size-136 rounded-full bg-chart-2/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 size-136 rounded-full bg-chart-3/20 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Nav                                                           */
/* ------------------------------------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="size-4" />
          </div>
          <span className="tracking-tight">Stucker</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/login">
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------- */
/* Hero                                                          */
/* ------------------------------------------------------------- */
async function UserCount() {
  const count = (await prisma.user.count()) + 1000;
  return <>{count.toLocaleString()}</>;
}

function UserCountSkeleton() {
  return (
    <span className="inline-block h-[1em] w-12 animate-pulse rounded bg-muted align-middle" />
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 text-center md:pt-24 md:pb-28">
      <div className="flex justify-center gap-2 mb-6">
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full text-green-800 border-green-500 bg-green-500/20 px-3 py-3 font-semibold text-xs"
        >
          <Sparkles className="size-3" />
          100% free — forever
        </Badge>
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full  px-3 py-3 font-semibold text-xs"
          title="Users"
        >
          <Users className="size-3" />
          <Suspense fallback={<UserCountSkeleton />}>
            <UserCount />
          </Suspense>
        </Badge>
      </div>

      <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
        <span className="font-bold">Track your study,</span>
        <br />
        <span className="bg-linear-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
          one session at a time.
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
        Stucker is a quiet place to log every study session — what you worked
        on, how long it took, and how it all adds up over the week. No accounts
        to buy. No paywalls. No noise.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-11 px-6">
          <Link href="/login">
            Start tracking — it&apos;s free
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 px-6">
          <Link href="#features">See what&apos;s inside</Link>
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        No credit card. No trial. No &ldquo;pro&rdquo; tier later. Just a tool.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------- */
/* Dashboard preview                                             */
/* ------------------------------------------------------------- */

const LESSON_CLASSES = {
  math: "border-chart-1/30 bg-chart-1/15 text-chart-1",
  geometry: "border-chart-2/30 bg-chart-2/15 text-chart-2",
  physics: "border-chart-3/30 bg-chart-3/15 text-chart-3",
  chemistry: "border-chart-4/30 bg-chart-4/15 text-chart-4",
} as const;

const PREVIEW_TRACKS = [
  { date: "Oct 12", lesson: "math", time: "09:00 – 10:30", dur: "90m" },
  { date: "Oct 12", lesson: "physics", time: "14:00 – 15:00", dur: "60m" },
  { date: "Oct 11", lesson: "geometry", time: "10:00 – 11:15", dur: "75m" },
  { date: "Oct 10", lesson: "chemistry", time: "16:00 – 17:30", dur: "90m" },
] as const;

function Preview() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
      <div className="relative">
        <div className="absolute -inset-x-6 -inset-y-6 -z-10 rounded-[2rem] bg-linear-to-r from-chart-1/15 via-chart-2/15 to-chart-3/15 blur-2xl" />

        <div className="overflow-hidden rounded-2xl border bg-card/70 shadow-2xl backdrop-blur-sm">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
            <div className="size-3 rounded-full bg-chart-2/60" />
            <div className="size-3 rounded-full bg-chart-4/60" />
            <div className="size-3 rounded-full bg-chart-3/60" />
            <div className="flex justify-between w-full items-center">
              <div className="ml-4 max-w-xs flex-1 rounded-md bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                stucker.app/dashboard
              </div>
              <div className="px-4 py-1.5 bg-foreground/60 text-background rounded-md text-xs">
                Add New Track
              </div>
            </div>
          </div>

          {/* Fake dashboard body */}
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6">
            <PreviewTracks />
            <div className="space-y-4">
              <PreviewBarChart />
              <PreviewPieChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewTracks() {
  return (
    <div className="rounded-xl border bg-background/60 p-4">
      <div className="mb-3">
        <div className="text-sm font-medium">Recent Tracks</div>
        <div className="text-xs text-muted-foreground">
          Your last {PREVIEW_TRACKS.length} sessions
        </div>
      </div>

      <div className="space-y-2">
        {PREVIEW_TRACKS.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{t.date}</span>
              <span
                className={`rounded-full border px-2 py-0.5 capitalize ${LESSON_CLASSES[t.lesson]}`}
              >
                {t.lesson}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-muted-foreground sm:inline">
                {t.time}
              </span>
              <span className="font-medium">{t.dur}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewBarChart() {
  const bars = [45, 70, 55, 90, 65, 40, 75];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="rounded-xl border bg-background/60 p-4">
      <div className="mb-3">
        <div className="text-sm font-medium">Study Duration</div>
        <div className="text-xs text-muted-foreground">8.5h this week</div>
      </div>

      <div className="flex h-24 items-end gap-2">
        {bars.map((h, i) => (
          <div key={i} className="flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-chart-1"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2 text-[10px] text-muted-foreground">
        {days.map((d, i) => (
          <span key={i} className="flex-1 text-center">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

function PreviewPieChart() {
  const slices = [
    { name: "Math", color: "var(--chart-1)", pct: "40%" },
    { name: "Geometry", color: "var(--chart-2)", pct: "25%" },
    { name: "Physics", color: "var(--chart-3)", pct: "20%" },
    { name: "Chemistry", color: "var(--chart-4)", pct: "15%" },
  ];

  return (
    <div className="rounded-xl border bg-background/60 p-4">
      <div className="mb-3">
        <div className="text-sm font-medium">Lessons Studied</div>
        <div className="text-xs text-muted-foreground">Breakdown this week</div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="size-20 shrink-0 rounded-full"
          style={{
            background:
              "conic-gradient(var(--chart-1) 0 40%, var(--chart-2) 40% 65%, var(--chart-3) 65% 85%, var(--chart-4) 85% 100%)",
          }}
        />

        <div className="flex-1 space-y-1.5 text-xs">
          {slices.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ background: s.color }}
              />
              <span className="flex-1 text-muted-foreground">{s.name}</span>
              <span className="font-medium">{s.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Features                                                      */
/* ------------------------------------------------------------- */

const FEATURES = [
  {
    icon: Zap,
    title: "Log a session in seconds",
    description:
      "Pick a date, a lesson, and a time range. Stucker computes the duration for you — you just show up and study.",
    span: "md:col-span-3",
  },
  {
    icon: TrendingUp,
    title: "Watch your week take shape",
    description:
      "Weekly and monthly views show where your hours actually went. Bars for time, pie for lessons, radar for balance.",
    span: "md:col-span-3",
  },
  {
    icon: BookOpen,
    title: "Any subject you study",
    description:
      "Math, physics, languages, coding — if you study it, Stucker tracks it.",
    span: "md:col-span-2",
  },
  {
    icon: Lock,
    title: "Private by default",
    description:
      "Your sessions are yours. No feeds, no sharing, no leaderboards.",
    span: "md:col-span-2",
  },
  {
    icon: Clock,
    title: "Zero friction",
    description:
      "No timers to forget. No start/stop buttons. Just log what happened.",
    span: "md:col-span-2",
  },
] as const;

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
      <div className="mb-12 text-center md:mb-16">
        <Badge variant="outline" className="mb-4 rounded-full">
          What&apos;s inside
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-balance text-muted-foreground">
          Built to be simple. Kept simple on purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {FEATURES.map((f) => (
          <Card
            key={f.title}
            className="group relative overflow-hidden transition-colors hover:bg-accent/40"
          >
            <CardHeader>
              <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-chart-1/15 text-chart-1 transition-transform group-hover:scale-105">
                <f.icon className="size-4" />
              </div>
              <CardTitle className="text-base">{f.title}</CardTitle>
              <CardDescription className="leading-relaxed">
                {f.description}
              </CardDescription>
            </CardHeader>
            <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-chart-1/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- */
/* Free forever                                                  */
/* ------------------------------------------------------------- */

function FreeForever() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
      <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-10 text-center backdrop-blur-sm md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-72 rounded-full bg-chart-2/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-chart-1/25 blur-3xl"
        />

        <div className="relative">
          <Badge variant="outline" className="mb-6 rounded-full">
            <Sparkles className="size-3" />
            The promise
          </Badge>

          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Free. Forever.
            <br />
            <span className="bg-linear-to-r from-chart-1 to-chart-3 bg-clip-text text-transparent">
              No asterisks.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground">
            Stucker is a personal project, not a business. There are no ads, no
            premium tier, no &ldquo;unlock charts&rdquo; moment coming later.
            Every feature is available to everyone, always.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-chart-3" />
              No ads
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-chart-1" />
              No premium tier
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-chart-2" />
              No data selling
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- */
/* Footer                                                        */
/* ------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BookOpen className="size-3.5" />
              </div>
              <span className="tracking-tight">Stucker</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A quiet place to track your study sessions. Free forever.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Pages</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about-us"
                  className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Terms & Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Made by</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Alireza Ezlegini
            </p>
            <a
              href={`mailto:${CREATOR_EMAIL}`}
              className="mt-1 inline-block text-sm text-foreground underline-offset-4 hover:underline"
            >
              {CREATOR_EMAIL}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-medium">Found a bug?</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Send an email — I read every one.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <a href={`mailto:${CREATOR_EMAIL}`}>
                <Mail className="size-4" />
                Get in touch
              </a>
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <Suspense fallback={<Skeleton className="h-4 w-40" />}>
            <CopyrightNotice />
          </Suspense>
          <p className="flex items-center gap-1.5">
            Built with
            <Heart className="size-3 fill-current text-chart-2" />
            by Alireza
          </p>
        </div>
      </div>
    </footer>
  );
}

async function CopyrightNotice() {
  await connection();
  const year = new Date().getFullYear();
  return <p>© {year} Stucker. Free forever.</p>;
}

export const metadata: Metadata = {
  title: {
    absolute: "Stucker — Track your study sessions",
  },
  description:
    "Track your study sessions, lessons, and weekly progress in one place.",
  openGraph: {
    title: "Stucker",
    description:
      "Track your study sessions, lessons, and weekly progress in one place.",
    type: "website",
    url: "/",
  },
};
