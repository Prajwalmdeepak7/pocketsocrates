import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({
  open,
  onOpenChange,
}: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark">
            Settings
          </DialogTitle>
          <DialogDescription className="font-fell text-base">
            Configure your PocketSocrates experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="font-cinzel text-lg">About</Label>
            <Separator className="my-2" />
            <p className="font-fell text-sm text-muted-foreground">
              PocketSocrates - Timeless philosophical advice for modern-day dilemmas
            </p>
            <p className="font-fell text-xs text-muted-foreground mt-2">
              Version 1.0.0
            </p>
          </div>

          <div>
            <Label className="font-cinzel text-lg">Exhibition</Label>
            <Separator className="my-2" />
            <p className="font-fell text-sm text-muted-foreground">
              Computer Science Exhibition 2025
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
