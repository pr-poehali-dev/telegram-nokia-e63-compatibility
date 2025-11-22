import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ChatsTabProps {
  filteredChats: Chat[];
  searchQuery: string;
  selectedIndex: number;
  setSearchQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  setSelectedChat: (id: number) => void;
}

const ChatsTab = ({
  filteredChats,
  searchQuery,
  selectedIndex,
  setSearchQuery,
  setSelectedIndex,
  setSelectedChat,
}: ChatsTabProps) => {
  return (
    <>
      <div className="p-2">
        <Input
          placeholder="Поиск чатов..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(0);
          }}
          className="h-8 text-sm"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat, index) => (
          <div key={chat.id}>
            <div 
              onClick={() => setSelectedChat(chat.id)}
              className={`p-3 cursor-pointer flex items-center gap-3 ${
                index === selectedIndex ? 'bg-accent' : 'hover:bg-secondary'
              }`}
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                    {chat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-sm truncate">{chat.name}</span>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <Badge className="ml-2 h-4 min-w-[16px] px-1 text-[10px] bg-primary">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
      <div className="p-2 bg-muted/50 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">2/8 или ↑↓ навигация | Enter открыть | 4/6 вкладки</p>
      </div>
    </>
  );
};

export default ChatsTab;
