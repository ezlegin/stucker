"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TrackerFormType, trackerFormSchema } from "@/lib/vlidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
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

export function TrackerForm() {
  const form = useForm<TrackerFormType>({
    resolver: zodResolver(trackerFormSchema),
    defaultValues: {
      from: new Date().toLocaleTimeString(),
      to: new Date().toLocaleTimeString(),
      date: new Date(),
    },
  });

  function onSubmit(data: TrackerFormType) {
    console.log(data);
  }

  const lessons = [
    { id: 1, title: "Math" },
    { id: 2, title: "Physics" },
    { id: 3, title: "Chemistry" },
  ];

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

        <Controller
          name="lessonId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Lesson</FieldLabel>

              <Select
                value={field.value == null ? undefined : String(field.value)}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a lesson" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={String(lesson.id)}>
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
        <Button type="submit">Submit</Button>
      </FieldGroup>
    </form>
  );
}

function getMinutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
