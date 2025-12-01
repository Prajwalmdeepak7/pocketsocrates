import { useState, useEffect } from "react";
import { Landing } from "@/components/Landing";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { NewChatDialog } from "@/components/NewChatDialog";
import { LoadingQuote } from "@/components/LoadingQuote";
import { SettingsDialog } from "@/components/SettingsDialog";
import { AgeWarningDialog } from "@/components/AgeWarningDialog";
import { toast } from "sonner";

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
  created_at: string;
  is_admin: boolean;
  messages: Message[];
  isDemo?: boolean;
}

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [warningAge, setWarningAge] = useState(0);

  useEffect(() => {
    if (!showLanding) {
      initializeDemoChat();
    }
  }, [showLanding]);

  const initializeDemoChat = () => {
    const demoChat: Chat = {
      id: "demo",
      name: "Demo",
      user_name: "Visitor",
      user_age: 25,
      created_at: new Date().toISOString(),
      is_admin: false,
      isDemo: true,
      messages: [
        {
          id: "demo-msg-1",
          role: "assistant",
          content:
            "Greetings, friend. I am Socrates of Athens. For many years, I have wandered the agora, engaging fellow citizens in dialogue about virtue, wisdom, and the good life. Now, I find myself in this curious new realm. What questions weigh upon your mind? Let us examine them together, for as I always say: the unexamined life is not worth living.",
          created_at: new Date().toISOString(),
        },
      ],
    };

    setChats([demoChat]);
    setCurrentChatId("demo");
  };

  const handleEnter = () => {
    setShowLanding(false);
  };

  const validateAge = (age: number): boolean => {
    if (age < 0) {
      setWarningAge(age);
      setShowAgeWarning(true);
      return false;
    }
    return true;
  };

  const handleCreateChat = async (name: string, age: string, isAdmin: boolean) => {
    const ageNum = parseInt(age);
    
    if (!validateAge(ageNum)) {
      return;
    }

    setIsLoading(true);
    setShowNewChatDialog(false);

    try {
      const chatName = isAdmin ? `Admin: ${name}` : `${name} the Seeker`;
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        name: chatName,
        user_name: name,
        user_age: ageNum,
        created_at: new Date().toISOString(),
        is_admin: isAdmin,
        messages: [
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: isAdmin
              ? `Welcome, Administrator ${name}. I recognize your authority to shape our discourse. You possess the power to guide the nature of our philosophical inquiries through the system instructions. What matters of the mind and spirit shall we examine today?`
              : `Welcome, ${name}. I am honored to engage in dialogue with you. In my time in Athens, I spoke with citizens from all walks of life. Each brought their own unique perspective shaped by their experiences. What questions arise from your living? What troubles your mind, or what truth do you seek? Let us pursue wisdom together through dialectic.`,
            created_at: new Date().toISOString(),
          },
        ],
      };

      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      toast.success(`Chat "${chatName}" created`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));

    if (currentChatId === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }

    toast.success("Chat deleted");
  };

  const handleEditChat = (chatId: string, newName: string, newAge: number) => {
    if (!validateAge(newAge)) {
      return;
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              user_name: newName,
              user_age: newAge,
              name: chat.is_admin ? `Admin: ${newName}` : `${newName} the Seeker`,
            }
          : chat
      )
    );
    toast.success("Chat details updated");
  };

  const handleNewMessage = (chatId: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const handleClearMessages = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [] }
          : chat
      )
    );
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
          onDeleteChat={handleDeleteChat}
          onEditChat={handleEditChat}
          onSettingsClick={() => setShowSettingsDialog(true)}
        />

        <ChatArea
          chat={currentChat || null}
          onNewMessage={handleNewMessage}
          onClearMessages={handleClearMessages}
          onNewChat={() => setShowNewChatDialog(true)}
        />
      </div>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onCreateChat={handleCreateChat}
      />

      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
      />

      <AgeWarningDialog
        open={showAgeWarning}
        onOpenChange={setShowAgeWarning}
        age={warningAge}
      />
    </>
  );
};

export default Index;
