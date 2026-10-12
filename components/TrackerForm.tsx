"use client";

import { createTrack, updateTrack } from "@/actions/tracker";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  LessonType,
  TrackerFormType,
  trackerFormSchema,
} from "@/lib/vlidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const lessons: { id: LessonType; title: string; color: string }[] = [
  { id: "math", title: "Math", color: "var(--chart-1)" },
  { id: "geometry", title: "Geometry", color: "var(--chart-2)" },
  { id: "physics", title: "Physics", color: "var(--chart-3)" },
  { id: "chemistry", title: "Chemistry", color: "var(--chart-4)" },
];

type TrackerFormProps = {
  initialData?: TrackerFormType & { id: number };
  onSuccess?: () => void;
};

export function TrackerForm({ initialData, onSuccess }: TrackerFormProps) {
  const isEdit = Boolean(initialData?.id);

  const form = useForm<TrackerFormType>({
    resolver: zodResolver(trackerFormSchema),
    defaultValues: initialData ?? {
      from: new Date().toLocaleTimeString("en-GB").slice(0, 5),
      to: new Date().toLocaleTimeString("en-GB").slice(0, 5),
      date: new Date(),
      lesson: "math",
    },
  });

  async function onSubmit(data: TrackerFormType) {
    const result = isEdit
      ? await updateTrack(initialData!.id, data)
      : await createTrack(data);

    if (result.success) {
      toast.success(isEdit ? "Updated!" : "Created!");
      onSuccess?.();
      if (!isEdit) form.reset();
    } else {
      toast.error(result.error);
    }
  }

  const from = form.watch("from");
  const to = form.watch("to");
  const duration = getMinutesFromTime(to) - getMinutesFromTime(from);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup className="gap-4">
        <div className="space-y-4">
          {/* Date */}
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between font-normal"
                    >
                      {field.value ? format(field.value, "PPP") : "Select date"}
                      <ChevronDownIcon className="size-4" />
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

          {/* From - To */}
          <div className="space-y-2">
            <div className="flex gap-4">
              {(["from", "to"] as const).map((name) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="min-w-0 flex-1">
                      <FieldLabel>{name === "from" ? "From" : "To"}</FieldLabel>
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
                        className="min-w-0 appearance-none bg-background"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}
            </div>
            <div className="text-center text-xs text-muted-foreground">
              {duration} minutes{" - "}
              <span className="font-bold">
                ({(duration / 60).toFixed(1)} hours)
              </span>
            </div>
          </div>
        </div>

        {/* Lesson — Radio Group */}
        <Controller
          name="lesson"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Lesson</FieldLabel>

              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={(value) => {
                  // ToggleGroup can emit "" when re-clicking; keep last valid
                  if (value) field.onChange(value);
                }}
                variant="outline"
                className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3"
              >
                {lessons.map((lesson) => (
                  <ToggleGroupItem
                    key={lesson.id}
                    value={lesson.id}
                    aria-label={lesson.title}
                    className="flex items-center justify-center gap-2 data-[state=on]:border-primary data-[state=on]:bg-accent cursor-pointer"
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: lesson.color }}
                    />
                    <span className="text-sm font-medium">{lesson.title}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update"
              : "Submit"}
        </Button>
      </FieldGroup>
    </form>
  );
}

function getMinutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
