import type { Metadata } from "next";
import { Heart, Mail, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Prose, StaticPageShell } from "@/components/StaticPageShell";

const CREATOR_EMAIL = "ezlegini.ir@gmail.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Stucker exists, who built it, and what it means to be free forever.",
};

export default function AboutPage() {
  return (
    <StaticPageShell>
      <Badge
        variant="outline"
        className="mb-6 gap-1.5 rounded-full border-chart-2/30 bg-chart-2/10 px-3 py-1 text-xs font-normal"
      >
        <Sparkles className="size-3" />
        About
      </Badge>

      <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
        A quiet place to see
        <br />
        <span className="bg-linear-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
          where your hours go.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
        Stucker is a personal study tracker built out of frustration with the
        alternatives — apps that gamify studying into a dopamine slot machine,
        lock the useful parts behind a subscription, or sell your focus to
        advertisers.
      </p>

      <Separator className="my-12" />

      <Prose>
        <div>
          <h2>The idea</h2>
          <p>
            I wanted something that just answered one question:{" "}
            <strong>where did my study time actually go?</strong> Not a habit
            tracker. Not a Pomodoro timer that yells at you. Not a gamified
            streak counter that turns learning into a chore.
          </p>
          <p>
            So Stucker does one thing: you log what you studied, for how long,
            and it shows you the shape of your week. That&apos;s it. Bars for
            duration, a pie for lessons, a radar for balance. No confetti, no
            badges, no streak that dies if you take a break.
          </p>
        </div>

        <div>
          <h2>Why it&apos;s free forever</h2>
          <p>
            Stucker is a personal project, not a business. There is no server
            bill I&apos;m trying to cover, no investors to impress, no growth
            chart to feed. Every feature is available to every user, always.
            There is no &ldquo;premium tier&rdquo; coming later, no
            &ldquo;unlock charts with Pro&rdquo; moment, and no plans to sell
            your data.
          </p>
          <p>
            If that ever changes, it will be because the app is shutting down —
            not because I&apos;ve decided to paywall something.
          </p>
        </div>

        <div>
          <h2>Privacy</h2>
          <ul>
            <li>
              Your study sessions are yours. They are not shared, not posted,
              not aggregated, not analyzed by anyone but you.
            </li>
            <li>
              There are no third-party analytics scripts, no tracking pixels, no
              ad networks.
            </li>
            <li>
              The only data Stucker stores is what you type in: an email, a
              password hash (or a Google account ID if you sign in with Google),
              and the sessions you log.
            </li>
          </ul>
        </div>
      </Prose>

      <Separator className="my-12" />

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-chart-1 to-chart-3 text-white shadow-sm">
            <User className="size-7" />
          </div>

          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Built by
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              Alireza Ezlegini
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Developer, occasionally studious. Made Stucker to track his own
              sessions and decided to share it.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={`mailto:${CREATOR_EMAIL}`}>
                  <Mail className="size-4" />
                  {CREATOR_EMAIL}
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-12" />

      <Prose>
        <div>
          <h2>Found a bug? Have an idea?</h2>
          <p>
            Email me. I read every message. Whether it&apos;s a broken chart, a
            feature that would make Stucker better for you, or just a
            &ldquo;hey, thanks for this,&rdquo; I want to hear it.
          </p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="size-4 fill-current text-chart-2" />{" "}
            and a lot of late nights.
          </p>
        </div>
      </Prose>
    </StaticPageShell>
  );
}
