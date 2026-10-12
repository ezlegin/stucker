"use client";

import { deleteTrack } from "@/actions/tracker";
import { EditTrackDialog } from "@/components/EditTrackDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrackerFormType } from "@/lib/vlidationSchemas";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BookOpen, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type Track = {
  id: number;
  date: Date;
  from: string;
  to: string;
  duration: number;
  lesson: string;
};

const LESSON_META: Record<
  string,
  { label: string; color: string; pill: string }
> = {
  math: {
    label: "Math",
    color: "var(--chart-1)",
    pill: "border-chart-1/30 bg-chart-1/10 text-chart-1",
  },
  geometry: {
    label: "Geometry",
    color: "var(--chart-2)",
    pill: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  },
  physics: {
    label: "Physics",
    color: "var(--chart-3)",
    pill: "border-chart-3/30 bg-chart-3/10 text-chart-3",
  },
  chemistry: {
    label: "Chemistry",
    color: "var(--chart-4)",
    pill: "border-chart-4/30 bg-chart-4/10 text-chart-4",
  },
};

export function TracksTable({ tracks }: { tracks: Track[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number) {
    startTransition(async () => {
      const res = await deleteTrack(id);
      res.success ? toast.success("Session removed") : toast.error(res.error);
    });
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>
              {tracks.length === 0
                ? "Nothing logged yet"
                : `Your last ${tracks.length} ${
                    tracks.length === 1 ? "session" : "sessions"
                  }`}
            </CardDescription>
          </div>

          {tracks.length > 0 && (
            <Badge
              variant="outline"
              className="rounded-full border-border/60 font-mono text-xs font-normal text-muted-foreground"
            >
              {tracks.length}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {tracks.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  Date
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  Lesson
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  Time
                </TableHead>
                <TableHead className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  Duration
                </TableHead>
                <TableHead className="pr-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((t) => {
                const meta = LESSON_META[t.lesson] ?? {
                  label: t.lesson,
                  color: "var(--muted-foreground)",
                  pill: "border-border bg-muted text-muted-foreground",
                };

                return (
                  <TableRow
                    key={t.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="pl-6">
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">
                          {format(new Date(t.date), "MMM d")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(t.date), "EEEE")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                          meta.pill,
                        )}
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{ background: meta.color }}
                        />
                        {meta.label}
                      </span>
                    </TableCell>

                    <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                      {t.from.slice(0, 5)} – {t.to.slice(0, 5)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-sm font-semibold">
                          {Math.round(t.duration)}
                        </span>
                        <span className="text-xs text-muted-foreground">m</span>
                      </div>
                    </TableCell>

                    <TableCell className="pr-6 text-right">
                      <div className="flex justify-end gap-0.5">
                        <EditTrackDialog
                          track={{
                            id: t.id,
                            date: new Date(t.date),
                            from: t.from,
                            to: t.to,
                            lesson: t.lesson as TrackerFormType["lesson"],
                          }}
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground opacity-40 transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          disabled={isPending}
                          onClick={() => handleDelete(t.id)}
                          aria-label="Delete track"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
        <BookOpen className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm font-medium">No sessions logged</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Track your first study session to see it appear here.
      </p>
    </div>
  );
}
