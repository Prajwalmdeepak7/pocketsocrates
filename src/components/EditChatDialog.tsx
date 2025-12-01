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

interface EditChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  currentAge: number;
  onSave: (name: string, age: number) => void;
}

export const EditChatDialog = ({
  open,
  onOpenChange,
  currentName,
  currentAge,
  onSave,
}: EditChatDialogProps) => {
  const [name, setName] = useState(currentName);
  const [age, setAge] = useState(currentAge.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age.trim()) {
      onSave(name.trim(), parseInt(age));
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel font-bold text-bronze-dark">
            Edit Details
          </DialogTitle>
          <DialogDescription className="font-fell text-base">
            Update the visitor's name and age
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="font-cinzel text-foreground">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-gold/30 focus:border-gold font-fell"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-age" className="font-cinzel text-foreground">
              Age
            </Label>
            <Input
              id="edit-age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border-2 border-gold/30 focus:border-gold font-fell"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-cinzel border-2 border-gold/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold"
              disabled={!name.trim() || !age.trim()}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
