import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface SetupPanelProps {
  onComplete: (name: string, age: string) => void;
}

export const SetupPanel = ({ onComplete }: SetupPanelProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age.trim()) {
      onComplete(name, age);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-full flex items-center justify-center p-8"
    >
      <div className="w-full max-w-md">
        <div className="marble-texture bg-card rounded-lg shadow-elevation border-2 border-gold/20 p-8">
          {/* Decorative top border */}
          <div className="greek-key-top mb-6 pb-6">
            <h2 className="text-3xl font-cinzel font-bold text-bronze-dark text-center">
              Begin Your Journey
            </h2>
            <p className="text-center text-muted-foreground mt-2 font-crimson italic">
              The unexamined life is not worth living
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-bronze font-cinzel text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gold/30 focus:border-gold bg-background/50 font-crimson text-lg h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-bronze font-cinzel text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                Your Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age..."
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-2 border-gold/30 focus:border-gold bg-background/50 font-crimson text-lg h-12"
                min="1"
                max="120"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel text-lg h-12 font-bold tracking-wide transition-all duration-300"
            >
              Enter the Agora
            </Button>
          </form>

          {/* Decorative quote */}
          <div className="mt-8 pt-6 greek-key-top">
            <blockquote className="text-center text-sm text-muted-foreground font-crimson italic">
              "Wonder is the beginning of wisdom"
              <footer className="mt-2 text-xs text-bronze">— Socrates</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
