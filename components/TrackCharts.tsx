"use client";

import { TrendingUp } from "lucide-react";
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

import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";

type Stat = { label: string; date: string; duration: number };
type LessonStat = {
  lessonId: string;
  name: string;
  color: string;
  duration: number;
};

const chartConfig = {
  duration: {
    label: "Hours",
    color: "#777",
  },
} satisfies ChartConfig;

export function TrackCharts({
  weekly,
  monthly,
  lessons,
}: {
  weekly: Stat[];
  monthly: Stat[];
  lessons: LessonStat[];
}) {
  // ⭐ single source of truth for the duration range
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");

  const totalWeek = weekly.reduce((s, d) => s + d.duration, 0);
  const totalMonth = monthly.reduce((s, d) => s + d.duration, 0);

  const activeData = range === "weekly" ? weekly : monthly;
  const activeSubtitle =
    range === "weekly"
      ? `${totalWeek.toFixed(1)}h this week`
      : `${totalMonth.toFixed(1)}h in 5 weeks`;

  return (
    <div className="space-y-6">
      {/* Duration Chart Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Study Duration</CardTitle>
              <CardDescription>Hours studied over time</CardDescription>
            </div>

            {/* Only TabsList here — no TabsContent */}
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
          {/* Conditionally render the chart — no TabsContent needed */}
          <DurationChartBlock data={activeData} subtitle={activeSubtitle} />
        </CardContent>
      </Card>

      {/* Lessons Studied Card */}
      <LessonsCard lessons={lessons} />
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Duration bar chart                                            */
/* ------------------------------------------------------------- */

function DurationChartBlock({
  data,
  subtitle,
}: {
  data: Stat[];
  subtitle: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <ChartContainer config={chartConfig} className="h-60 w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={32}
            tickFormatter={(v) => `${v}h`}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="duration"
            fill="var(--color-duration)"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ChartContainer>
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
    lesson: l.lessonId,
    label: l.name,
    duration: l.duration,
    fill: l.color,
  }));

  const radarData = sorted.map((l) => ({
    lesson: l.lessonId,
    label: l.name,
    duration: l.duration,
  }));

  const pieConfig = {
    duration: { label: "Hours" },
    ...lessons.reduce<ChartConfig>((acc, l) => {
      acc[l.lessonId] = { label: l.name, color: l.color };
      return acc;
    }, {}),
  } satisfies ChartConfig;

  const radarConfig = {
    duration: { label: "Hours", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const top = pieData[0];
  const topPct = total > 0 && top ? (top.duration / total) * 100 : 0;

  if (lessons.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Lessons Studied</CardTitle>
          <CardDescription>Breakdown for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-10 text-center text-sm text-muted-foreground">
            No lessons studied this week.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      {/* ⭐ Header: title + toggle side-by-side */}
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Lessons Studied</CardTitle>
            <CardDescription>Breakdown for the current week</CardDescription>
          </div>

          {/* Only TabsList here — no TabsContent. */}
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "pie" | "radar")}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="pie">Pie</TabsTrigger>
              <TabsTrigger value="radar">Radar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* ⭐ Conditionally render the chart — no TabsContent needed */}
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
              <PolarAngleAxis dataKey="label" />
              <PolarGrid />
              <Radar
                dataKey="duration"
                fill="var(--color-duration)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        )}

        {/* Progress breakdown (shared) */}
        <div className="mt-6 space-y-4">
          {pieData.map((l) => {
            const max = Math.max(...pieData.map((x) => x.duration), 1);
            return (
              <div key={l.lesson} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: l.fill }}
                    />
                    <span className="font-medium">{l.label}</span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {l.duration.toFixed(1)}h
                  </Badge>
                </div>
                <Progress
                  value={(l.duration / max) * 100}
                  className="h-1.5"
                  indicatorClassName="bg-[#777]"
                />
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        {top && (
          <div className="flex items-center gap-2 leading-none font-medium">
            {top.label} leads with {topPct.toFixed(0)}%
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          {total.toFixed(1)} total hours studied
        </div>
      </CardFooter>
    </Card>
  );
}
