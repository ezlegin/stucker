"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart as PieIcon,
  Radar as RadarIcon,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";

type Stat = { label: string; date: string; duration: number };
type LessonStat = { lesson: string; duration: number };

const chartConfig = {
  duration: { label: "Hours", color: "var(--chart-1)" },
} satisfies ChartConfig;

const lessonColor: Record<string, string> = {
  math: "var(--chart-1)",
  geometry: "var(--chart-2)",
  physics: "var(--chart-3)",
  chemistry: "var(--chart-4)",
};

const lessonLabel: Record<string, string> = {
  math: "Math",
  geometry: "Geometry",
  physics: "Physics",
  chemistry: "Chemistry",
};

export function TrackCharts({
  weekly,
  monthly,
  lessons,
}: {
  weekly: Stat[];
  monthly: Stat[];
  lessons: LessonStat[];
}) {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");

  const totalWeek = weekly.reduce((s, d) => s + d.duration, 0);
  const totalMonth = monthly.reduce((s, d) => s + d.duration, 0);

  const activeData = range === "weekly" ? weekly : monthly;
  const activeTotal = range === "weekly" ? totalWeek : totalMonth;
  const activeCaption = range === "weekly" ? "this week" : "over 5 weeks";
  const hasDuration = activeData.some((d) => d.duration > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Study Duration</CardTitle>
              <CardDescription>Hours studied over time</CardDescription>
            </div>

            <Tabs
              value={range}
              onValueChange={(v) => setRange(v as "weekly" | "monthly")}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {activeTotal.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">hours</span>
            <span className="ml-1 text-xs text-muted-foreground">
              {activeCaption}
            </span>
          </div>

          {hasDuration ? (
            <ChartContainer config={chartConfig} className="h-56 w-full">
              <BarChart accessibilityLayer data={activeData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={28}
                  fontSize={11}
                  tickFormatter={(v) => `${v}h`}
                />
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="duration"
                  fill="var(--color-duration)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <ChartEmptyState
              message={
                range === "weekly"
                  ? "No sessions logged this week"
                  : "No sessions logged in the last 5 weeks"
              }
            />
          )}
        </CardContent>
      </Card>

      <LessonsCard lessons={lessons} />
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Duration bar chart helper — keep slot for future use          */
/* ------------------------------------------------------------- */

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Lessons card — Pie / Radar toggle                             */
/* ------------------------------------------------------------- */

function LessonsCard({ lessons }: { lessons: LessonStat[] }) {
  const [view, setView] = useState<"pie" | "radar">("pie");

  const total = lessons.reduce((s, l) => s + l.duration, 0);
  const sorted = [...lessons].sort((a, b) => b.duration - a.duration);

  const pieData = sorted.map((l) => ({
    lesson: l.lesson,
    label: lessonLabel[l.lesson] ?? l.lesson,
    duration: l.duration,
    fill: `var(--color-${l.lesson})`,
  }));

  const radarData = sorted.map((l) => ({
    lesson: l.lesson,
    label: lessonLabel[l.lesson] ?? l.lesson,
    duration: l.duration,
  }));

  const pieConfig = {
    duration: { label: "Hours" },
    ...lessons.reduce<ChartConfig>((acc, l) => {
      acc[l.lesson] = {
        label: lessonLabel[l.lesson] ?? l.lesson,
        color: lessonColor[l.lesson] ?? "var(--chart-1)",
      };
      return acc;
    }, {}),
  } satisfies ChartConfig;

  const radarConfig = {
    duration: { label: "Hours", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const top = pieData[0];
  const topPct = total > 0 && top ? (top.duration / total) * 100 : 0;
  const maxLesson = Math.max(...pieData.map((l) => l.duration), 1);

  if (lessons.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Lessons Studied</CardTitle>
          <CardDescription>Breakdown for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartEmptyState message="No lessons studied this week" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Lessons Studied</CardTitle>
            <CardDescription>Breakdown for the current week</CardDescription>
          </div>

          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "pie" | "radar")}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="pie" className="gap-1.5">
                <PieIcon className="size-3.5" />
                Pie
              </TabsTrigger>
              <TabsTrigger value="radar" className="gap-1.5">
                <RadarIcon className="size-3.5" />
                Radar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {view === "pie" && (
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="lesson"
                    formatter={(value, _name, item) => {
                      const v = Number(value);
                      const pct = total > 0 ? (v / total) * 100 : 0;
                      return [
                        `${v.toFixed(1)}h · ${pct.toFixed(0)}%`,
                        (item?.payload as { label?: string })?.label ?? "",
                      ];
                    }}
                  />
                }
              />
              <Pie data={pieData} dataKey="duration" nameKey="lesson" />
            </PieChart>
          </ChartContainer>
        )}

        {view === "radar" && (
          <ChartContainer
            config={radarConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            <RadarChart data={radarData}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    nameKey="lesson"
                    formatter={(value, _name, item) => {
                      const v = Number(value);
                      const pct = total > 0 ? (v / total) * 100 : 0;
                      return [
                        `${v.toFixed(1)}h · ${pct.toFixed(0)}%`,
                        (item?.payload as { label?: string })?.label ?? "",
                      ];
                    }}
                  />
                }
              />
              <PolarAngleAxis dataKey="label" fontSize={11} />
              <PolarGrid stroke="var(--border)" />
              <Radar
                dataKey="duration"
                fill="var(--color-duration)"
                fillOpacity={0.55}
                stroke="var(--color-duration)"
              />
            </RadarChart>
          </ChartContainer>
        )}

        <div className="mt-6 space-y-3.5">
          {pieData.map((l) => (
            <div key={l.lesson} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: `var(--color-${l.lesson})` }}
                  />
                  <span className="font-medium">{l.label}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {l.duration.toFixed(1)}h ·{" "}
                  {total > 0 ? ((l.duration / total) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <Progress
                value={(l.duration / maxLesson) * 100}
                className="h-1.5"
              />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1.5 border-t bg-muted/20 pt-4 text-sm">
        {top && (
          <div className="flex items-center gap-2 leading-none font-medium">
            <TrendingUp className="size-4 text-chart-3" />
            {top.label} leads with {topPct.toFixed(0)}%
          </div>
        )}
        <div className="text-xs leading-none text-muted-foreground">
          {total.toFixed(1)} total hours studied
        </div>
      </CardFooter>
    </Card>
  );
}
