"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteLesson } from "@/actions/lesson";
import { Button } from "./ui/button";

type Lesson = { id: string; name: string; color: string };

export function DeleteLessonButton({
  lesson,
  onDeleted,
}: {
  lesson: Lesson;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    const res = await deleteLesson(lesson.id);
    setPending(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success("Lesson deleted", {
      description: `“${lesson.name}” and its sessions have been removed.`,
    });
    onDeleted(lesson.id);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          aria-label={`Delete ${lesson.name}`}
          onClick={(e) => e.stopPropagation()}
          variant={"ghost"}
          size={"icon-sm"}
          className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &ldquo;{lesson.name}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Every study session logged under this lesson will be permanently
            deleted along with it. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={pending}
            className="bg-destructive text-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete lesson"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
