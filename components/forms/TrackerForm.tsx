"use client";

import { getLessons } from "@/actions/lesson";
import { createTrack, updateTrack } from "@/actions/tracker";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TrackerFormType, trackerFormSchema } from "@/lib/vlidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { addHours, format } from "date-fns";
import {
  CalendarIcon,
  ChevronDownIcon,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AddLessonDialog } from "../AddLessonDialog";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DeleteLessonButton } from "../DleteLessonButton";
type Lesson = { id: string; name: string; color: string };

type TrackerFormProps = {
  initialData?: TrackerFormType & { id: number };
  onSuccess?: () => void;
};

function getDefaultTimes() {
  const from = new Date();
  const to = addHours(new Date(), 2);

  return {
    from: formatTime(from),
    to: formatTime(to),
  };
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function TrackerForm({ initialData, onSuccess }: TrackerFormProps) {
  const isEdit = Boolean(initialData?.id);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  const form = useForm<TrackerFormType>({
    resolver: zodResolver(trackerFormSchema),
    defaultValues: initialData ?? {
      ...getDefaultTimes(),
      date: new Date(),
      lessonId: "",
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await getLessons();
      if (cancelled) return;
      if (res.success) {
        setLessons(res.data);
        // Auto-select the first lesson if nothing is selected
        if (!form.getValues("lessonId") && res.data.length > 0) {
          form.setValue("lessonId", res.data[0].id);
        }
      }
      setLoadingLessons(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLessonCreated(lesson: Lesson) {
    const res = await getLessons();
    if (res.success) setLessons(res.data);
    form.setValue("lessonId", lesson.id, { shouldValidate: true });
  }

  async function onSubmit(data: TrackerFormType) {
    const result = isEdit
      ? await updateTrack(initialData!.id, data)
      : await createTrack(data);

    if (result.success) {
      toast.success(isEdit ? "Session updated" : "Session logged", {
        description: isEdit
          ? "Your changes have been saved."
          : "Nice work — keep it up.",
      });
      onSuccess?.();
      if (!isEdit) form.reset({ ...form.getValues(), lessonId: data.lessonId });
    } else {
      toast.error(result.error);
    }
  }

  const from = form.watch("from");
  const to = form.watch("to");
  const duration = getMinutesFromTime(to) - getMinutesFromTime(from);

  const { isSubmitting } = form.formState;

  function handleLessonDeleted(deletedId: string) {
    const remaining = lessons.filter((l) => l.id !== deletedId);
    setLessons(remaining);

    if (form.getValues("lessonId") === deletedId) {
      form.setValue("lessonId", remaining[0]?.id ?? "", {
        shouldValidate: true,
      });
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <FieldGroup className="gap-5">
        {/* ── Section: When ─────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeading icon={CalendarIcon} label="When" />

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-11 w-full justify-between rounded-lg px-3.5 font-normal",
                        !field.value && "text-muted-foreground",
                        fieldState.invalid && "border-destructive/60",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="size-4 text-muted-foreground" />
                        {field.value
                          ? format(field.value, "EEEE, MMM d, yyyy")
                          : "Pick a date"}
                      </span>
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      disabled={{ after: new Date() }}
                      selected={field.value}
                      defaultMonth={field.value}
                      captionLayout="dropdown"
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* From / To side-by-side with a connecting dash */}
          <div className="flex items-end gap-2">
            {(["from", "to"] as const).map((name, idx) => (
              <div key={name} className="flex min-w-0 flex-1 items-end gap-2">
                <Controller
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="min-w-0 flex-1">
                      <FieldLabel className="text-xs font-medium text-muted-foreground">
                        {name === "from" ? "Start" : "End"}
                      </FieldLabel>
                      <Input
                        type="time"
                        lang="en-GB"
                        step="60"
                        value={field.value.slice(0, 5)}
                        onChange={(e) => {
                          if (e.target.value) {
                            field.onChange(`${e.target.value}:00`);
                          }
                        }}
                        className={cn(
                          "h-11 min-w-0 appearance-none rounded-lg bg-background px-3.5 font-mono text-sm tabular-nums",
                          fieldState.invalid && "border-destructive/60",
                        )}
                      />
                    </Field>
                  )}
                />

                {idx === 0 && (
                  <div className="flex h-11 items-center pb-1 text-muted-foreground">
                    <span className="text-sm">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live duration readout */}
          <DurationBadge minutes={duration} invalid={duration <= 0} />
        </section>

        {/* ── Section: What ─────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionHeading icon={Sparkles} label="What did you study?" />
            <AddLessonDialog onCreated={handleLessonCreated} />
          </div>

          <Controller
            name="lessonId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {loadingLessons ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-12 animate-pulse rounded-lg bg-muted" />
                    <div className="h-12 animate-pulse rounded-lg bg-muted" />
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      You don&apos;t have any lessons yet.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Click <strong>Add lesson</strong> to create your first
                      one.
                    </p>
                  </div>
                ) : (
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                    variant="outline"
                    className="grid w-full grid-cols-2 gap-2"
                  >
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className="group relative">
                        <ToggleGroupItem
                          value={lesson.id}
                          aria-label={lesson.name}
                          style={
                            {
                              "--lesson-color": lesson.color,
                            } as React.CSSProperties
                          }
                          className="h-12 w-full cursor-pointer justify-start gap-2.5 rounded-lg border bg-card pr-9 pl-3.5 text-sm font-medium transition-all data-[state=on]:border-(--lesson-color) data-[state=on]:ring-2 data-[state=on]:ring-[color-mix(in_oklab,var(--lesson-color)_35%,transparent)] data-[state=on]:ring-offset-0"
                        >
                          <span
                            className="size-3 shrink-0 rounded-full ring-2 ring-background transition-transform group-hover:scale-110"
                            style={{ background: lesson.color }}
                          />
                          <span className="truncate">{lesson.name}</span>
                        </ToggleGroupItem>

                        <DeleteLessonButton
                          lesson={lesson}
                          onDeleted={handleLessonDeleted}
                        />
                      </div>
                    ))}
                  </ToggleGroup>
                )}

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </section>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || duration <= 0 || !form.watch("lessonId")}
          className="mt-1 h-11 w-full rounded-lg shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEdit ? "Saving changes..." : "Logging session..."}
            </>
          ) : isEdit ? (
            <>
              <Pencil className="size-4" />
              Save changes
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Log session
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

/* ------------------------------------------------------------- */
/* Sub-components                                                */
/* ------------------------------------------------------------- */

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-5 items-center justify-center rounded-md bg-muted">
        <Icon className="size-3 text-muted-foreground" />
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function DurationBadge({
  minutes,
  invalid,
}: {
  minutes: number;
  invalid: boolean;
}) {
  const valid = !invalid && minutes > 0;
  const hours = minutes / 60;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-3.5 py-2.5 transition-colors",
        valid
          ? "border-chart-3/30 bg-chart-3/10"
          : "border-destructive/30 bg-destructive/5",
      )}
    >
      <span className="flex items-center gap-2 text-xs font-medium">
        <Clock
          className={cn(
            "size-3.5",
            valid ? "text-chart-3" : "text-destructive",
          )}
        />
        <span className={valid ? "text-muted-foreground" : "text-destructive"}>
          {valid ? "Duration" : "Invalid time range"}
        </span>
      </span>

      {valid ? (
        <span className="flex items-baseline gap-1.5 font-mono tabular-nums">
          <span className="text-base font-semibold">{minutes}</span>
          <span className="text-xs text-muted-foreground">min</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-sm font-medium">{hours.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">h</span>
        </span>
      ) : (
        <span className="text-xs text-destructive">
          End must be after start
        </span>
      )}
    </div>
  );
}

function getMinutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
