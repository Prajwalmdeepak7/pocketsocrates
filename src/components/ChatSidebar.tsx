import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface Chat {
  id: string;
  name: string;
  created_at: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export const ChatSidebar = ({
  chats,
  currentChatId,
  searchQuery,
  onSearchChange,
  onChatSelect,
  onNewChat,
}: ChatSidebarProps) => {
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r-2 border-gold/20 bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-gold/20 bg-gradient-bronze">
        <h2 className="text-2xl font-cinzel font-bold text-card mb-4">
          PocketSocrates
        </h2>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold mb-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats..."
            className="pl-10 border-2 border-gold/30 focus:border-gold bg-background/50 font-crimson"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 p-2">
        {filteredChats.map((chat, index) => (
          <motion.button
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full text-left p-4 rounded-lg mb-2 transition-all duration-200 ${
              currentChatId === chat.id
                ? "bg-gradient-gold text-bronze-dark shadow-elevation"
                : "hover:bg-card/50 text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-cinzel font-semibold truncate">{chat.name}</p>
                <p className="text-xs opacity-70 font-crimson">
                  {new Date(chat.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </ScrollArea>
    </div>
  );
};