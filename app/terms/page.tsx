import type { Metadata } from "next";
import { FileText, Mail, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Prose, StaticPageShell } from "@/components/StaticPageShell";

const CREATOR_EMAIL = "ezlegini.ir@gmail.com";
const LAST_UPDATED = "October 12, 2026";

export const metadata: Metadata = {
  title: "Terms & Privacy",
  description:
    "The plain-language terms of service and privacy policy for Stucker.",
};

export default function TermsPage() {
  return (
    <StaticPageShell>
      <Badge
        variant="outline"
        className="mb-6 gap-1.5 rounded-full border-chart-1/30 bg-chart-1/10 px-3 py-1 text-xs font-normal"
      >
        <FileText className="size-3" />
        Terms & Privacy
      </Badge>

      <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
        Plain words.
        <br />
        <span className="bg-linear-to-r from-chart-3 via-chart-1 to-chart-4 bg-clip-text text-transparent">
          No legal fog.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
        This isn&apos;t a corporate contract. It&apos;s an honest description of
        how Stucker works, what it stores, and what you can expect from it. Read
        it once and you&apos;ll understand everything.
      </p>

      <p className="mt-4 text-xs text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <Separator className="my-12" />

      {/* At-a-glance summary */}
      <Card className="overflow-hidden border-chart-3/30 bg-chart-3/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-chart-3">
            <ShieldCheck className="size-4" />
            <CardTitle className="text-sm font-medium uppercase tracking-wider">
              The short version
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-3" />
              <span>
                Stucker is free, and no one is going to ask you to pay for it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-3" />
              <span>
                Your data is yours. We don&apos;t sell it, share it, or analyze
                it for anyone but you.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-3" />
              <span>
                The only things stored are your email, a hashed password (or
                Google account link), and the sessions you log.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-3" />
              <span>
                No warranty, no liability. Stucker is a personal tool, not a
                company. Use it because it&apos;s useful, not because it&apos;s
                guaranteed.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Prose>
        <div>
          <h2>1. What Stucker is</h2>
          <p>
            Stucker is a personal study-tracking web application. You log study
            sessions — a lesson, a start time, an end time — and it shows you
            statistics about how you&apos;ve been spending your time. That is
            the entire scope of the service.
          </p>
        </div>

        <div>
          <h2>2. Your account</h2>
          <p>
            You can sign in with an email and password, or with Google. You are
            responsible for keeping your credentials safe. If you believe your
            account has been compromised, email{" "}
            <a
              href={`mailto:${CREATOR_EMAIL}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {CREATOR_EMAIL}
            </a>{" "}
            and the account can be reset or deleted.
          </p>
        </div>

        <div>
          <h2>3. What we store</h2>
          <ul>
            <li>
              <strong>Account information:</strong> your email address. If you
              sign in with a password, a bcrypt hash — never the plaintext. If
              you sign in with Google, the account identifier Google returns.
            </li>
            <li>
              <strong>Study sessions:</strong> the lesson you picked, the date,
              the start time, the end time, and the computed duration.
            </li>
            <li>
              <strong>Nothing else.</strong> No IP addresses, no device
              fingerprints, no behavioral analytics, no third-party tracking.
            </li>
          </ul>
        </div>

        <div>
          <h2>4. What we don&apos;t do</h2>
          <ul>
            <li>We don&apos;t sell or share your data with anyone.</li>
            <li>We don&apos;t run ads or affiliate links.</li>
            <li>
              We don&apos;t mine your sessions for &ldquo;insights.&rdquo;
            </li>
            <li>
              We don&apos;t have a premium tier, and we don&apos;t plan to add
              one.
            </li>
          </ul>
        </div>

        <div>
          <h2>5. Cookies</h2>
          <p>
            Stucker uses a single authentication cookie to keep you signed in.
            That&apos;s it — no analytics cookies, no advertising cookies, no
            cross-site trackers.
          </p>
        </div>

        <div>
          <h2>6. Deleting your data</h2>
          <p>
            Email{" "}
            <a
              href={`mailto:${CREATOR_EMAIL}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {CREATOR_EMAIL}
            </a>{" "}
            and your account, sessions, and any associated records will be
            deleted. No questions, no retention period, no &ldquo;your data may
            persist in backups for 90 days&rdquo; fine print.
          </p>
        </div>

        <div>
          <h2>7. Acceptable use</h2>
          <p>
            Use Stucker for its intended purpose: tracking your own studying.
            Don&apos;t attempt to break the service, scrape other users&apos;
            data, or abuse the infrastructure. If you find a security issue,
            please email rather than exploiting it.
          </p>
        </div>

        <div>
          <h2>8. No warranty</h2>
          <p>
            Stucker is provided &ldquo;as is.&rdquo; It&apos;s a personal
            project. I try to keep it running and free of bugs, but I can&apos;t
            guarantee it will always be available, that data will never be lost,
            or that any specific feature will always work. Back up anything you
            care about.
          </p>
        </div>

        <div>
          <h2>9. Limitation of liability</h2>
          <p>
            Stucker is not liable for any damages arising from use of the
            service — including lost study time, lost data, or any indirect or
            consequential damages. By using Stucker, you accept this.
          </p>
        </div>

        <div>
          <h2>10. Changes to these terms</h2>
          <p>
            If these terms ever change materially, the &ldquo;last
            updated&rdquo; date at the top will change. Continuing to use
            Stucker after a change means you accept the new terms.
          </p>
        </div>
      </Prose>

      <Separator className="my-12" />

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-medium">Questions?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There&apos;s no legal team. Just email me.
            </p>
          </div>

          <Button asChild variant="outline">
            <a href={`mailto:${CREATOR_EMAIL}`}>
              <Mail className="size-4" />
              {CREATOR_EMAIL}
            </a>
          </Button>
        </CardContent>
      </Card>
    </StaticPageShell>
  );
}
