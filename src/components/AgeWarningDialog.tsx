import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AgeWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  age: number;
}

export const AgeWarningDialog = ({ open, onOpenChange, age }: AgeWarningDialogProps) => {
  const absAge = Math.abs(age);
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-2 border-gold/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cinzel text-bronze-dark text-xl">
            Future Visitor
          </AlertDialogTitle>
          <AlertDialogDescription className="font-fell text-lg">
            {age} years? So you will be born {absAge} year{absAge !== 1 ? 's' : ''} after today? 
            Then come to me {absAge} year{absAge !== 1 ? 's' : ''} later once you're born.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold">
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
