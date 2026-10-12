"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner"; // optional
import { updateTrack, createTrack } from "@/actions/tracker";
import {
  LessonType,
  TrackerFormType,
  trackerFormSchema,
} from "@/lib/vlidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

const lessons: { id: LessonType; title: string }[] = [
  { id: "math", title: "Math" },
  { id: "geometry", title: "Geometry" },
  { id: "physics", title: "Physics" },
  { id: "chemistry", title: "Chemistry" },
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
              Duration: {duration} minutes ({(duration / 60).toFixed(1)} hours)
            </div>
          </div>
        </div>

        {/* Lesson */}
        <Controller
          name="lesson"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Lesson</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a lesson" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
