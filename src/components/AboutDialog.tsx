import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-2 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark">
            About Socrates
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4 font-fell text-foreground">
            <p>
              <span className="font-cinzel font-bold text-bronze-dark">Socrates of Athens</span> (c. 470–399 BCE) 
              was a classical Greek philosopher credited as the founder of Western philosophy and among the first 
              moral philosophers of the ethical tradition of thought.
            </p>

            <p>
              Known for his method of questioning — the <span className="italic">Socratic method</span> — he believed 
              that the pursuit of truth and self-knowledge was the highest form of human activity.
            </p>

            <p>
              His famous declaration, <span className="italic text-gold">"The unexamined life is not worth living,"</span> 
              captures his philosophy that wisdom begins with recognizing one's own ignorance.
            </p>

            <p>
              Though Socrates left no written works, his ideas survived through his students, particularly Plato, 
              whose dialogues immortalized his teacher's philosophical inquiries.
            </p>

            <p className="text-sm text-muted-foreground pt-4 border-t border-gold/20">
              This digital experience was created by Prajwal, a 15-year-old whom Socrates deeply respects, 
              to bring ancient wisdom to modern learners.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
