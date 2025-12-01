import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => {
  const commands = [
    {
      command: "/close",
      description: "End the current chat session and view takeaways from your dialogue",
    },
    {
      command: "/new",
      description: "Start a brand-new conversation with Socrates",
    },
    {
      command: "/voice",
      description: "Toggle interactive voice mode — Socrates will speak his replies aloud",
    },
    {
      command: "/mute",
      description: "Mute or unmute Socrates' audio while keeping text responses visible",
    },
    {
      command: "/clear",
      description: "Clear the visible conversation history while keeping the chat session active",
    },
    {
      command: "/about",
      description: "Learn about Socrates of Athens and his philosophical legacy",
    },
    {
      command: "/help",
      description: "Display this list of available commands",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-2 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark">
            Available Commands
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {commands.map((cmd) => (
              <div key={cmd.command} className="space-y-1">
                <code className="font-mono text-gold font-bold bg-bronze/10 px-2 py-1 rounded">
                  {cmd.command}
                </code>
                <p className="font-fell text-sm text-muted-foreground pl-2">
                  {cmd.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
