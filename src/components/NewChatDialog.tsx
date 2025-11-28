import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChat: (name: string, age: string) => void;
}

export const NewChatDialog = ({
  open,
  onOpenChange,
  onCreateChat,
}: NewChatDialogProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age.trim()) {
      onCreateChat(name.trim(), age.trim());
      setName("");
      setAge("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark">
            Begin Your Philosophical Journey
          </DialogTitle>
          <DialogDescription className="font-crimson text-base">
            Share your name and age to create a personalized dialogue with Socrates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-cinzel text-foreground">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border-2 border-gold/30 focus:border-gold font-crimson"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="font-cinzel text-foreground">
              Your Age
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="border-2 border-gold/30 focus:border-gold font-crimson"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold"
            disabled={!name.trim() || !age.trim()}
          >
            Create Chat
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};