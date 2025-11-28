import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="greek-key-bottom bg-gradient-gold py-8 px-6 relative overflow-hidden"
    >
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-bronze-dark opacity-30" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-bronze-dark opacity-30" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-bronze-dark" />
          </motion.div>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-cinzel font-black text-bronze-dark tracking-wider">
              ΣΩΚΡΑΤΗΣ
            </h1>
            <p className="text-lg md:text-xl font-crimson text-bronze mt-2 tracking-wide italic">
              Ancient Wisdom for Modern Times
            </p>
          </div>
          
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-bronze-dark" />
          </motion.div>
        </div>
      </div>
      
      {/* Exhibition subtitle */}
      <div className="text-center mt-4">
        <span className="text-sm font-cinzel text-bronze-dark/80 tracking-widest uppercase">
          Exhibition Version
        </span>
      </div>
    </motion.header>
  );
};
