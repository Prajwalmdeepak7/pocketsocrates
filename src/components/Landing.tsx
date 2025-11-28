import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LandingProps {
  onEnter: () => void;
}

export const Landing = ({ onEnter }: LandingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center marble-texture">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6 max-w-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-8"
        >
          <Sparkles className="w-16 h-16 text-gold" />
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-cinzel font-black text-bronze-dark mb-4 tracking-wider">
          PocketSocrates
        </h1>

        <p className="text-xl md:text-2xl font-crimson text-bronze mb-12 italic leading-relaxed">
          Timeless philosophical advice for modern-day dilemmas
        </p>

        <Button
          onClick={onEnter}
          className="bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold text-xl px-12 py-6 h-auto transition-all duration-300"
        >
          Enter
        </Button>
      </motion.div>
    </div>
  );
};