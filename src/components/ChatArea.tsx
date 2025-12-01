import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Mic, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SystemInstructionsDialog } from "./SystemInstructionsDialog";
import { TakeawaysDialog } from "./TakeawaysDialog";
import { AboutDialog } from "./AboutDialog";
import { HelpDialog } from "./HelpDialog";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Chat {
  id: string;
  name: string;
  user_name: string;
  user_age: number;
  is_admin: boolean;
  messages: Message[];
}

interface ChatAreaProps {
  chat: Chat | null;
  onNewMessage: (chatId: string, message: Message) => void;
  onClearMessages: (chatId: string) => void;
  onNewChat: () => void;
}

export const ChatArea = ({ chat, onNewMessage, onClearMessages, onNewChat }: ChatAreaProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [showTakeawaysDialog, setShowTakeawaysDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();

    if (cmd === "/close") {
      await generateTakeaways();
      return true;
    } else if (cmd === "/new") {
      onNewChat();
      return true;
    } else if (cmd === "/voice") {
      setVoiceMode(!voiceMode);
      toast.success(voiceMode ? "Voice mode disabled" : "Voice mode enabled");
      return true;
    } else if (cmd === "/mute") {
      setIsMuted(!isMuted);
      toast.success(isMuted ? "Unmuted" : "Muted");
      return true;
    } else if (cmd === "/clear") {
      if (chat) {
        onClearMessages(chat.id);
        toast.success("Messages cleared");
      }
      return true;
    } else if (cmd === "/about") {
      setShowAboutDialog(true);
      return true;
    } else if (cmd === "/help") {
      setShowHelpDialog(true);
      return true;
    }

    return false;
  };

  const generateTakeaways = async () => {
    if (!chat || chat.messages.length === 0) {
      toast.error("No conversation to summarize");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: chat.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          generateTakeaways: true,
        },
      });

      if (error) throw error;

      const content = data.content;
      const parts = content.split("REFLECTION:");
      const bulletPoints = parts[0]
        .split("\n")
        .filter((line: string) => line.trim().startsWith("-"))
        .map((line: string) => line.trim().substring(1).trim());
      
      const reflectionText = parts[1]?.trim() || "What you discovered today is a step on the path to wisdom.";

      setTakeaways(bulletPoints);
      setReflection(reflectionText);
      setShowTakeawaysDialog(true);
    } catch (error) {
      console.error("Error generating takeaways:", error);
      toast.error("Failed to generate takeaways");
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!voiceMode || isMuted) return;

    setIsSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text },
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording...");
    } catch (error) {
      console.error("Microphone error:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    toast.info("Transcribing your question...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(",")[1];

        const { data, error } = await supabase.functions.invoke("speech-to-text", {
          body: { audio: base64Audio },
        });

        if (error) throw error;

        setInput(data.text);
        toast.success("Transcription complete");
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Failed to transcribe audio");
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage = input.trim();

    if (userMessage.startsWith("/")) {
      const wasCommand = await handleCommand(userMessage);
      if (wasCommand) {
        setInput("");
        return;
      }
    }

    if (chat.is_admin && (userMessage.toLowerCase() === "system instructions" || userMessage.toLowerCase() === "instructions")) {
      setShowInstructionsDialog(true);
      setInput("");
      return;
    }

    setInput("");
    setIsLoading(true);

    try {
      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: userMessage,
        created_at: new Date().toISOString(),
      };
      onNewMessage(chat.id, userMsg);

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            ...chat.messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: userMessage },
          ],
          chatId: chat.id,
          userName: chat.user_name,
          userAge: chat.user_age,
        },
      });

      if (error) throw error;

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.content,
        created_at: new Date().toISOString(),
      };
      onNewMessage(chat.id, assistantMsg);

      await speakText(data.content);
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

  if (!chat) {
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
      <div className="greek-key-bottom bg-gradient-bronze p-6 border-b-2 border-gold/20">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1 }}
            className={isSpeaking ? "shadow-gold" : ""}
          >
            <Sparkles className="w-6 h-6 text-gold" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-cinzel font-bold text-card">{chat.name}</h2>
            <p className="text-lg font-fell text-gold/90 italic">A dialogue with Socrates</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 marble-texture">
        <AnimatePresence>
          {chat.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
            >
              <div className={`inline-block max-w-[80%] rounded-lg p-4 shadow-elevation ${
                  message.role === "user"
                    ? "bg-gradient-gold text-bronze-dark"
                    : "bg-card border-2 border-bronze/20 text-foreground"
                }`}
              >
                <p className="font-fell text-lg leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <div className={`text-xs text-muted-foreground mt-1 font-cinzel ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.role === "user" ? chat.user_name : "Socrates"}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="greek-key-top bg-card p-6 border-t-2 border-gold/20">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className={`border-2 border-gold/30 ${isRecording ? "bg-destructive text-white" : ""}`}
          >
            <Mic className="w-5 h-5" />
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with Socrates..."
            disabled={isLoading}
            className="flex-1 border-2 border-gold/30 focus:border-gold bg-background/50 font-fell text-lg h-12"
          />

          {voiceMode && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="border-2 border-gold/30"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          )}
          
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
        <p className="text-xs text-muted-foreground text-center mt-3 font-fell italic">
          Press Enter to send • Shift+Enter for new line • Type /help for commands
        </p>
      </div>

      <SystemInstructionsDialog open={showInstructionsDialog} onOpenChange={setShowInstructionsDialog} />
      <TakeawaysDialog open={showTakeawaysDialog} onOpenChange={setShowTakeawaysDialog} takeaways={takeaways} reflection={reflection} onNewChat={() => { setShowTakeawaysDialog(false); onNewChat(); }} />
      <AboutDialog open={showAboutDialog} onOpenChange={setShowAboutDialog} />
      <HelpDialog open={showHelpDialog} onOpenChange={setShowHelpDialog} />
    </div>
  );
};
