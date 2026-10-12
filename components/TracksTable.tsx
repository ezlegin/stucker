"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteTrack } from "@/actions/tracker";

type Track = {
  id: number;
  date: Date;
  from: string;
  to: string;
  duration: number;
  lesson: string;
};

const lessonVariant: Record<string, string> = {
  math: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  geometry: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  physics: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  chemistry: "bg-chart-4/15 text-chart-4 border-chart-4/30",
};

export function TracksTable({ tracks }: { tracks: Track[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number) {
    startTransition(async () => {
      const res = await deleteTrack(id);
      res.success ? toast.success("Track deleted") : toast.error(res.error);
    });
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Recent Tracks</CardTitle>
        <CardDescription>
          Your last {tracks.length} study sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {tracks.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            No tracks yet. Add your first one!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Lesson</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="pr-6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((t) => (
                <TableRow key={t.id} className="group">
                  <TableCell className="pl-6 text-sm">
                    {format(new Date(t.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${lessonVariant[t.lesson] ?? ""}`}
                    >
                      {t.lesson}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.from.slice(0, 5)} – {t.to.slice(0, 5)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {Math.round(t.duration)}m
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 transition group-hover:opacity-100"
                      disabled={isPending}
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
