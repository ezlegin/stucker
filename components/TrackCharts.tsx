// components/TrackCharts.tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Stat = { label: string; date: string; duration: number };
type LessonStat = { lesson: string; duration: number };

const chartConfig = {
  duration: {
    label: "Hours",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const lessonColor: Record<string, string> = {
  math: "var(--chart-1)",
  geometry: "var(--chart-2)",
  physics: "var(--chart-3)",
  chemistry: "var(--chart-4)",
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
  const totalWeek = weekly.reduce((s, d) => s + d.duration, 0);
  const totalMonth = monthly.reduce((s, d) => s + d.duration, 0);
  const maxLesson = Math.max(...lessons.map((l) => l.duration), 1);

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Study Duration</CardTitle>
              <CardDescription>Hours studied over time</CardDescription>
            </div>
            <Tabs defaultValue="weekly" className="w-auto">
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsContent value="weekly" className="mt-0">
              <ChartBlock
                data={weekly}
                subtitle={`${totalWeek.toFixed(1)}h this week`}
              />
            </TabsContent>
            <TabsContent value="monthly" className="mt-0">
              <ChartBlock
                data={monthly}
                subtitle={`${totalMonth.toFixed(1)}h in 5 weeks`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lessons Studied Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lessons Studied</CardTitle>
          <CardDescription>Breakdown for the current week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lessons.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No lessons studied this week.
            </p>
          ) : (
            lessons.map((l) => (
              <div key={l.lesson} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        background: lessonColor[l.lesson] ?? "var(--chart-1)",
                      }}
                    />
                    <span className="font-medium capitalize">{l.lesson}</span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {l.duration.toFixed(1)}h
                  </Badge>
                </div>
                <Progress
                  value={(l.duration / maxLesson) * 100}
                  className="h-1.5"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ChartBlock({ data, subtitle }: { data: Stat[]; subtitle: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <ChartContainer config={chartConfig} className="h-[240px] w-full">
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
