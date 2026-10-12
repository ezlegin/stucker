import { AddTrackDialog } from "@/components/AddTrackDialog";
import { TracksTable } from "@/components/TracksTable";
import { TrackCharts } from "@/components/TrackCharts";
import { Separator } from "@/components/ui/separator";
import { getTracks } from "@/actions/tracker";
import {
  getWeeklyStats,
  getMonthlyStats,
  getLessonsThisWeek,
} from "@/lib/tracker";

export default async function Page() {
  const [tracksRes, weeklyRes, monthlyRes, lessonsRes] = await Promise.all([
    getTracks(),
    getWeeklyStats(),
    getMonthlyStats(),
    getLessonsThisWeek(),
  ]);

  const tracks = tracksRes.success ? tracksRes.data : [];
  const weekly = weeklyRes.success ? weeklyRes.data : [];
  const monthly = monthlyRes.success ? monthlyRes.data : [];
  const lessons = lessonsRes.success ? lessonsRes.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome, Alireza!
          </h1>
          <p className="text-sm text-muted-foreground">
            What did you do today?
          </p>
        </div>
        <AddTrackDialog />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TracksTable tracks={tracks} />
        <TrackCharts weekly={weekly} monthly={monthly} lessons={lessons} />
      </div>
    </div>
  );
}
