"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrackerForm } from "@/components/forms/TrackerForm";
import type { TrackerFormType } from "@/lib/vlidationSchemas";

type Track = TrackerFormType & { id: number };

export function EditTrackDialog({ track }: { track: Track }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="opacity-30 transition group-hover:opacity-100"
          aria-label="Edit track"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogTitle className="sr-only">Edit Track</DialogTitle>
        <TrackerForm initialData={track} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
