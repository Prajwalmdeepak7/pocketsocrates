import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface ChatAreaProps {
  chatId: string | null;
  chatName: string;
}

export const ChatArea = ({ chatId, chatName }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      loadMessages();
      subscribeToMessages();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadMessages = async () => {
    if (!chatId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
      return;
    }

    setMessages((data || []) as Message[]);
  };

  const subscribeToMessages = () => {
    if (!chatId) return;

    const channel = supabase
      .channel(`messages-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSend = async () => {
    if (!input.trim() || !chatId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Save user message
      const { error: userError } = await supabase.from("messages").insert({
        chat_id: chatId,
        role: "user",
        content: userMessage,
      });

      if (userError) throw userError;

      // Get chat history for context
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call OpenRouter via edge function
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            ...chatHistory,
            { role: "user", content: userMessage },
          ],
        },
      });

      if (error) throw error;

      // Save assistant message
      await supabase.from("messages").insert({
        chat_id: chatId,
        role: "assistant",
        content: data.content,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <Sparkles className="w-16 h-16 text-gold mx-auto mb-4" />
          <h3 className="text-2xl font-cinzel font-bold text-bronze-dark mb-2">
            Welcome to PocketSocrates
          </h3>
          <p className="text-lg font-crimson text-muted-foreground">
            Select a chat or create a new one to begin your philosophical journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="greek-key-bottom bg-gradient-bronze p-6 border-b-2 border-gold/20">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-gold" />
          <div>
            <h2 className="text-2xl font-cinzel font-bold text-card">
              {chatName}
            </h2>
            <p className="text-sm text-gold/90 font-crimson italic">
              A dialogue with Socrates
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
              transition={{ duration: 0.4, delay: index * 0.05 }}
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
                <p className="font-crimson text-lg leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <div
                className={`text-xs text-muted-foreground mt-1 font-cinzel ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.role === "user" ? "You" : "Socrates"}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="greek-key-top bg-card p-6 border-t-2 border-gold/20">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with Socrates..."
            disabled={isLoading}
            className="flex-1 border-2 border-gold/30 focus:border-gold bg-background/50 font-crimson text-lg h-12"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold px-8 h-12 transition-all duration-300"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-bronze-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3 font-crimson italic">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};