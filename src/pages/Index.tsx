import { useState, useEffect } from "react";
import { Landing } from "@/components/Landing";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { NewChatDialog } from "@/components/NewChatDialog";
import { LoadingQuote } from "@/components/LoadingQuote";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Chat {
  id: string;
  name: string;
  user_name: string | null;
  user_age: number | null;
  created_at: string;
}

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  useEffect(() => {
    if (!showLanding) {
      loadChats();
    }
  }, [showLanding]);

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setChats(data || []);

      // If no chats exist, create Demo chat
      if (!data || data.length === 0) {
        await createDemoChat();
      } else {
        // Select the most recent chat
        setCurrentChatId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      toast.error("Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoChat = async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .insert({
          name: "Demo",
          user_name: null,
          user_age: null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add welcome message
      await supabase.from("messages").insert({
        chat_id: data.id,
        role: "assistant",
        content:
          "Greetings, friend. I am Socrates of Athens. For many years, I have wandered the agora, engaging fellow citizens in dialogue about virtue, wisdom, and the good life. Now, I find myself in this curious new realm. What questions weigh upon your mind? Let us examine them together, for as I always say: the unexamined life is not worth living.",
      });

      setChats([data]);
      setCurrentChatId(data.id);
    } catch (error) {
      console.error("Error creating demo chat:", error);
      toast.error("Failed to create demo chat");
    }
  };

  const handleEnter = () => {
    setShowLanding(false);
  };

  const handleCreateChat = async (name: string, age: string) => {
    setIsLoading(true);
    setShowNewChatDialog(false);

    try {
      const chatName = `${name} the Seeker`;
      const { data, error } = await supabase
        .from("chats")
        .insert({
          name: chatName,
          user_name: name,
          user_age: parseInt(age),
        })
        .select()
        .single();

      if (error) throw error;

      // Add welcome message
      await supabase.from("messages").insert({
        chat_id: data.id,
        role: "assistant",
        content: `Welcome, ${name}. I am honored to engage in dialogue with someone ${age} years of age. You have accumulated experiences worthy of philosophical examination. In my time in Athens, I spoke with citizens of all ages - from young Plato to elder statesmen. Each brought their own unique perspective shaped by their years. What questions arise from your ${age} years of living? What troubles your mind, or what truth do you seek? Let us pursue wisdom together through dialectic.`,
      });

      setChats((prev) => [data, ...prev]);
      setCurrentChatId(data.id);
      toast.success(`Chat "${chatName}" created`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    } finally {
      setIsLoading(false);
    }
  };

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  if (showLanding) {
    return <Landing onEnter={handleEnter} />;
  }

  return (
    <>
      {isLoading && <LoadingQuote />}
      
      <div className="min-h-screen flex marble-texture">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onChatSelect={setCurrentChatId}
          onNewChat={() => setShowNewChatDialog(true)}
        />
        
        <ChatArea
          chatId={currentChatId}
          chatName={currentChat?.name || ""}
        />
      </div>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onCreateChat={handleCreateChat}
      />
    </>
  );
};

export default Index;
