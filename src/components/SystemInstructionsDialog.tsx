import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SystemInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SystemInstructionsDialog = ({
  open,
  onOpenChange,
}: SystemInstructionsDialogProps) => {
  const [instructions, setInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadInstructions();
    }
  }, [open]);

  const loadInstructions = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "system_instructions")
        .single();

      if (error) throw error;
      setInstructions(data.value);
    } catch (error) {
      console.error("Error loading instructions:", error);
      toast.error("Failed to load system instructions");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ value: instructions })
        .eq("key", "system_instructions");

      if (error) throw error;

      toast.success("System instructions updated");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving instructions:", error);
      toast.error("Failed to save system instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-2 border-gold/20 max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark">
            System Instructions
          </DialogTitle>
          <DialogDescription className="font-fell text-base">
            Configure how Socrates responds to all conversations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter system instructions..."
            className="min-h-[300px] border-2 border-gold/30 focus:border-gold font-fell text-base"
          />

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-cinzel border-2 border-gold/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold"
            >
              {isLoading ? "Saving..." : "Save Instructions"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
