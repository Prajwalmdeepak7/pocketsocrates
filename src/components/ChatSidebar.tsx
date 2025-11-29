import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, MessageSquare, Trash2, Settings } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps {
  chats: Array<{ id: string; name: string; created_at: string }>;
  currentChatId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSettingsClick: () => void;
}

export const ChatSidebar = ({
  chats,
  currentChatId,
  searchQuery,
  onSearchChange,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onSettingsClick,
}: ChatSidebarProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      onDeleteChat(chatToDelete);
      setChatToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="w-80 bg-card border-r-2 border-gold/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-2 border-gold/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-cinzel font-bold text-bronze-dark">
              Dialogues
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="hover:bg-gold/10"
            >
              <Settings className="w-5 h-5 text-gold" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search dialogues..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-2 border-gold/30 focus:border-gold bg-background/50 font-fell"
            />
          </div>

          <Button
            onClick={onNewChat}
            className="w-full bg-gradient-gold hover:shadow-gold text-bronze-dark font-cinzel font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Dialogue
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 p-2">
          {filteredChats.map((chat, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 group mb-2 ${
                currentChatId === chat.id
                  ? "bg-gradient-gold shadow-elevation"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    currentChatId === chat.id
                      ? "text-bronze-dark"
                      : "text-gold"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-cinzel font-semibold truncate ${
                      currentChatId === chat.id
                        ? "text-bronze-dark"
                        : "text-foreground"
                    }`}
                  >
                    {chat.name}
                  </h3>
                  <p
                    className={`text-xs font-fell ${
                      currentChatId === chat.id
                        ? "text-bronze-dark/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {new Date(chat.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDeleteClick(chat.id, e)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    currentChatId === chat.id
                      ? "hover:bg-bronze-dark/10"
                      : "hover:bg-gold/10"
                  }`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-2 border-gold/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel text-bronze-dark">
              Delete Dialogue
            </AlertDialogTitle>
            <AlertDialogDescription className="font-fell">
              Are you sure you want to delete this dialogue? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-cinzel">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 font-cinzel"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
