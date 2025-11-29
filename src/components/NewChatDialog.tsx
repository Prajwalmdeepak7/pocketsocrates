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
import { toast } from "sonner";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChat: (name: string, age: string, isAdmin: boolean) => void;
}

export const NewChatDialog = ({
  open,
  onOpenChange,
  onCreateChat,
}: NewChatDialogProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age.trim()) {
      // Check if user is trying to login as admin
      if (name.trim().toLowerCase() === "admin") {
        setShowPasswordPrompt(true);
      } else {
        onCreateChat(name.trim(), age.trim(), false);
        setName("");
        setAge("");
      }
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "ramaphosa") {
      onCreateChat(name.trim(), age.trim(), true);
      setName("");
      setAge("");
      setPassword("");
      setShowPasswordPrompt(false);
      toast.success("Admin access granted");
    } else {
      toast.error("Incorrect password");
      setPassword("");
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setShowPasswordPrompt(false);
          setPassword("");
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-card border-2 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark">
            {showPasswordPrompt ? "Admin Access" : "Know Thyself"}
          </DialogTitle>
          <DialogDescription className="font-fell text-base">
            {showPasswordPrompt 
              ? "Enter the admin password to continue."
              : "Share your name and age to begin your dialogue with Socrates."
            }
          </DialogDescription>
        </DialogHeader>

        {!showPasswordPrompt ? (
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
                className="border-2 border-gold/30 focus:border-gold font-fell"
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
                className="border-2 border-gold/30 focus:border-gold font-fell"
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
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-cinzel text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="border-2 border-gold/30 focus:border-gold font-fell"
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPassword("");
                }}
                className="flex-1 font-cinzel border-2 border-gold/30"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold"
                disabled={!password}
              >
                Enter
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};