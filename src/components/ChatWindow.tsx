import { useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ChatWindowProps {
  currentChat: Chat;
  currentMessages: Message[];
  messageText: string;
  isWriting: boolean;
  setMessageText: (text: string) => void;
  setIsWriting: (isWriting: boolean) => void;
  setSelectedChat: (id: number | null) => void;
  handleSendMessage: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ChatWindow = ({
  currentChat,
  currentMessages,
  messageText,
  isWriting,
  setMessageText,
  setIsWriting,
  setSelectedChat,
  handleSendMessage,
  handleImageUpload,
  handleKeyDown,
  textareaRef,
  fileInputRef,
}: ChatWindowProps) => {
  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedChat(null)} className="hover:bg-primary/80 p-1 rounded">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary-foreground text-primary">
              {currentChat.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-medium">{currentChat.name}</h2>
            <p className="text-[10px] opacity-80">{currentChat.online ? 'онлайн' : 'не в сети'}</p>
          </div>
        </div>
        <Icon name="MoreVertical" size={20} />
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {currentMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded p-2 ${msg.isMine ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
              {msg.type === 'image' && msg.imageUrl && (
                <img src={msg.imageUrl} alt={msg.text} className="rounded mb-1 max-w-full" />
              )}
              <p className="text-sm break-words">{msg.text}</p>
              <span className="text-[10px] opacity-70 mt-1 block">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-2 bg-card">
        {isWriting ? (
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Введите сообщение..."
                className="flex-1 min-h-[64px] text-sm"
                rows={3}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                className="h-10 w-10 p-0"
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">Enter отправить | Esc отменить</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 px-2 text-xs"
              >
                <Icon name="Image" size={14} className="mr-1" />
                Фото
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsWriting(true);
                  setTimeout(() => textareaRef.current?.focus(), 0);
                }}
                className="h-10 text-xs"
              >
                <Icon name="Edit3" size={14} className="mr-1" />
                Написать
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 text-xs"
              >
                <Icon name="Image" size={14} className="mr-1" />
                Фото
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedChat(null);
                  setIsWriting(false);
                }}
                className="h-10 text-xs"
              >
                <Icon name="ArrowLeft" size={14} className="mr-1" />
                Назад
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">Enter написать | P фото | Esc выход</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ChatWindow;
