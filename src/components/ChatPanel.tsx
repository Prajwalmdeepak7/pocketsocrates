import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  userName: string;
  userAge: string;
}

export const ChatPanel = ({ userName, userAge }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Greetings, ${userName}. I am honored to engage in dialogue with you. At ${userAge} years of age, you have accumulated experiences worthy of philosophical examination. What questions weigh upon your mind? Let us pursue wisdom together through the ancient art of dialectic.`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate Socratic response
    setTimeout(() => {
      const responses = [
        "What do you mean by that? Can you define your terms more precisely?",
        "An interesting perspective. But have you considered the opposite position?",
        "Let us examine this claim more carefully. What evidence supports this view?",
        "I must confess ignorance. Perhaps together we can discover the truth through questioning.",
        "Your words are thoughtful. Yet I wonder - is this truly what you believe, or what you have been told to believe?",
      ];

      const socraticResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setMessages((prev) => [...prev, socraticResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-full flex flex-col"
    >
      {/* Chat header */}
      <div className="greek-key-bottom bg-gradient-bronze p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-gold" />
          <div>
            <h2 className="text-2xl font-cinzel font-bold text-card">
              The Dialogue
            </h2>
            <p className="text-sm text-gold/90 font-crimson italic">
              Engage in Socratic wisdom
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6 marble-texture">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] rounded-lg p-4 shadow-elevation ${
                  message.role === "user"
                    ? "bg-gradient-gold text-bronze-dark"
                    : "bg-card border-2 border-bronze/20 text-foreground"
                }`}
              >
                <p className="font-crimson text-lg leading-relaxed">
                  {message.content}
                </p>
              </div>
              <div
                className={`text-xs text-muted-foreground mt-1 font-cinzel ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.role === "user" ? userName : "Socrates"}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      {/* Input area */}
      <div className="greek-key-top bg-card p-6 border-t-2 border-gold/20">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            className="flex-1 border-2 border-gold/30 focus:border-gold bg-background/50 font-crimson text-lg h-12"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold px-8 h-12 transition-all duration-300"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3 font-crimson italic">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </motion.div>
  );
};
