import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const philosophicalQuotes = [
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "To find yourself, think for yourself.", author: "Socrates" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "I cannot teach anybody anything. I can only make them think.", author: "Socrates" },
  { text: "Wonder is the beginning of wisdom.", author: "Socrates" },
  { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" },
  { text: "He who is not contented with what he has, would not be contented with what he would like to have.", author: "Socrates" },
  { text: "True knowledge exists in knowing that you know nothing.", author: "Socrates" },
];

export const LoadingQuote = () => {
  const [quote] = useState(() => 
    philosophicalQuotes[Math.floor(Math.random() * philosophicalQuotes.length)]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center px-6 max-w-2xl">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </motion.div>

        <blockquote className="border-l-4 border-gold pl-6 py-4">
          <p className="font-fell text-2xl italic text-foreground mb-4 leading-relaxed">
            "{quote.text}"
          </p>
          <footer className="text-lg text-bronze font-cinzel tracking-wider">
            — {quote.author}
          </footer>
        </blockquote>
      </div>
    </motion.div>
  );
};