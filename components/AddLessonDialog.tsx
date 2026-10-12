"use client";

import { useState } from "react";
import { Loader2, Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createLesson } from "@/actions/lesson";

type Lesson = { id: string; name: string; color: string };

export function AddLessonDialog({
  onCreated,
}: {
  onCreated: (lesson: Lesson) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give your lesson a name");
      return;
    }

    setPending(true);
    const res = await createLesson({ name: trimmed });
    setPending(false);

    if (!res.success) {
      setError(res.error);
      return;
    }

    toast.success("Lesson added", {
      description: `“${res.data.name}” is ready to use.`,
    });
    onCreated(res.data);
    setName("");
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) {
      setName("");
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-3.5" />
          Add lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="z-60 sm:max-w-sm">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-chart-1/15 text-chart-1">
            <Tag className="size-4" />
          </div>
          <DialogTitle>New lesson</DialogTitle>
          <DialogDescription>
            Give it a name — you can pick a color-coded session next time you
            log one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup className="gap-3">
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="lesson-name">Lesson name</FieldLabel>
              <Input
                id="lesson-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spanish, Algorithms, Piano"
                maxLength={40}
                autoFocus
                disabled={pending}
                aria-invalid={!!error}
                className="h-11"
              />
              {error && <FieldError errors={[{ message: error }]} />}
            </Field>
          </FieldGroup>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={pending || !name.trim()}
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Add lesson
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
