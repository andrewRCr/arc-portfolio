"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardContentInset } from "./CardContentInset";

/**
 * Overlays Section
 *
 * Showcases overlay components: popovers, tooltips, and dialogs.
 */
export function OverlaysSection() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card id="overlays">
      <CardHeader>
        <CardTitle className="text-2xl">Overlays</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          {/* Tooltips */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Tooltips</h3>
            <div className="flex flex-wrap gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary">Another tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Tooltips can appear on different sides</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Popovers */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Popovers</h3>
            <div className="flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Popover Title</h4>
                    <p className="text-sm text-muted-foreground">
                      Popovers are great for displaying additional context or options.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Dialogs */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Dialogs</h3>
            <div className="flex flex-wrap gap-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This is a dialog description. Dialogs are used for important interactions that require user
                      attention.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                      Dialog content goes here. You can include forms, information, or any other content.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContentInset>
      </CardContent>
    </Card>
  );
}
