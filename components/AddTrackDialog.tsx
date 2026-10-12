"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrackerForm } from "@/components/TrackerForm";

export function AddTrackDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Track
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogTitle className="sr-only">Add Your New Track</DialogTitle>
        <TrackerForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
