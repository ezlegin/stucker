import { ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/10 blur-3xl dark:bg-destructive/20"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border bg-card shadow-sm">
          <ShieldAlert className="size-9 text-destructive" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">
          Authentication failed
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Something went wrong while signing you in. This is usually temporary —
          please try again in a moment.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-10 text-xs text-muted-foreground/70">
          If this keeps happening,{" "}
          <Link
            href="/contact"
            className="underline underline-offset-4 hover:text-foreground"
          >
            contact us.
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
