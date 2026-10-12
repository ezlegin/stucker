import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddTrackDialog } from "@/components/AddTrackDialog";
import { TracksTable } from "@/components/TracksTable";
import { TrackCharts } from "@/components/ui/TrackCharts";
import { Skeleton } from "@/components/ui/skeleton";
import SignOutButton from "@/components/SignOutButton";
import {
  getTracks,
  getWeeklyStats,
  getMonthlyStats,
  getLessonsThisWeek,
} from "@/lib/tracker";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<PageHeaderSkeleton />}>
        <PageHeader />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<TracksTableSkeleton />}>
          <TracksTableData />
        </Suspense>

        <Suspense fallback={<TrackChartsSkeleton />}>
          <TrackChartsData />
        </Suspense>
      </div>
    </div>
  );
}

async function PageHeader() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const name = session.user.name ?? session.user.email ?? "there";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <div className="flex size-12  items-center justify-center rounded-2xl bg-emerald-400 font-semibold tracking-wide text-primary-foreground shadow-sm">
            {initials}
          </div>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s how your studying is going.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SignOutButton />
        <AddTrackDialog />
      </div>
    </div>
  );
}

async function TracksTableData() {
  const tracksRes = await getTracks(10);
  return <TracksTable tracks={tracksRes.success ? tracksRes.data : []} />;
}

async function TrackChartsData() {
  const [weeklyRes, monthlyRes, lessonsRes] = await Promise.all([
    getWeeklyStats(),
    getMonthlyStats(),
    getLessonsThisWeek(),
  ]);

  return (
    <TrackCharts
      weekly={weeklyRes.success ? weeklyRes.data : []}
      monthly={monthlyRes.success ? monthlyRes.data : []}
      lessons={lessonsRes.success ? lessonsRes.data : []}
    />
  );
}

/* ------------------------------------------------------------- */
/* Skeletons                                                     */
/* ------------------------------------------------------------- */

function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}

function TracksTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-44" />
        </div>
        <Skeleton className="h-5 w-8 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackChartsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-60 w-full" />
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="mx-auto h-56 w-56 rounded-full" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
