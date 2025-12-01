import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface TakeawaysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  takeaways: string[];
  reflection: string;
  onNewChat: () => void;
}

export const TakeawaysDialog = ({
  open,
  onOpenChange,
  takeaways,
  reflection,
  onNewChat,
}: TakeawaysDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-2 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold" />
            Takeaways
          </DialogTitle>
          <DialogDescription className="font-fell text-base">
            Reflections from your dialogue with Socrates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            {takeaways.map((takeaway, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-gold font-cinzel">•</span>
                <p className="font-fell text-foreground">{takeaway}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gradient-gold/20 rounded-lg border-2 border-gold/30">
            <p className="font-fell italic text-bronze-dark">"{reflection}"</p>
            <p className="text-xs text-bronze-dark/70 font-cinzel mt-2 text-right">
              — Socrates
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-cinzel border-2 border-gold/30"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onNewChat();
                onOpenChange(false);
              }}
              className="flex-1 bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold"
            >
              Start New Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
