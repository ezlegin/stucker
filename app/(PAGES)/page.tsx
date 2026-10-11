"use client";

import { TrackerForm } from "@/components/TrackerForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-3xl">Welcome, Alireza!</h1>
          <p className="text-muted-foreground text-sm">
            What did you do today?
          </p>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                Add Track
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogTitle className="sr-only">Add Your New Track</DialogTitle>
              <TrackerForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />
    </div>
  );
};

export default page;
