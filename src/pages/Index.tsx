import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Contact {
  id: number;
  name: string;
  status: string;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [messageText, setMessageText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: 'Привет! Как дела?', time: '14:20', isMine: false, type: 'text' },
      { id: 2, text: 'Хорошо, спасибо! А у тебя?', time: '14:22', isMine: true, type: 'text' },
      { id: 3, text: 'Как дела?', time: '14:23', isMine: false, type: 'text' },
    ],
    3: [
      { id: 1, text: 'Отправил файлы', time: '12:10', isMine: false, type: 'text' },
    ],
  });

  const chats: Chat[] = [
    { id: 1, name: 'Мама', lastMessage: 'Как дела?', time: '14:23', unread: 2, online: true },
    { id: 2, name: 'Рабочая группа', lastMessage: 'Встреча завтра в 10:00', time: '13:45', unread: 5, online: false },
    { id: 3, name: 'Андрей', lastMessage: 'Отправил файлы', time: '12:10', unread: 0, online: true },
    { id: 4, name: 'Анна', lastMessage: 'Спасибо за помощь!', time: '11:30', unread: 0, online: false },
    { id: 5, name: 'Семья', lastMessage: 'Фото: IMG_2341.jpg', time: '10:15', unread: 1, online: false },
  ];

  const contacts: Contact[] = [
    { id: 1, name: 'Андрей', status: 'Онлайн', online: true },
    { id: 2, name: 'Анна', status: 'Был(а) 2 часа назад', online: false },
    { id: 3, name: 'Борис', status: 'Онлайн', online: true },
    { id: 4, name: 'Вера', status: 'Был(а) вчера', online: false },
    { id: 5, name: 'Григорий', status: 'Онлайн', online: true },
    { id: 6, name: 'Дарья', status: 'Был(а) 5 минут назад', online: false },
  ];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedChat) return;

    const currentList = activeTab === 'chats' ? filteredChats : activeTab === 'contacts' ? filteredContacts : [];
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, currentList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeTab === 'chats' && filteredChats[selectedIndex]) {
        setSelectedChat(filteredChats[selectedIndex].id);
      } else if (activeTab === 'contacts' && filteredContacts[selectedIndex]) {
        const contact = filteredContacts[selectedIndex];
        const existingChat = chats.find(c => c.name === contact.name);
        if (existingChat) {
          setSelectedChat(existingChat.id);
          setActiveTab('chats');
        }
      }
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));
    setMessageText('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newMessage: Message = {
        id: Date.now(),
        text: file.name,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
        type: 'image',
        imageUrl: event.target?.result as string
      };

      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage]
      }));
    };
    reader.readAsDataURL(file);
  };

  const currentChat = chats.find(c => c.id === selectedChat);
  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

  if (selectedChat && currentChat) {
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
          <div className="flex items-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 p-0"
            >
              <Icon name="Paperclip" size={16} />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Сообщение..."
              className="flex-1 min-h-[32px] h-8 text-sm resize-none"
              rows={1}
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              className="h-8 w-8 p-0"
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">↑↓ навигация | Enter выбор | Esc назад</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Send" size={20} />
          <h1 className="text-lg font-medium">Telegram E63</h1>
        </div>
        <Icon name="MoreVertical" size={20} />
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chats' && (
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
              <p className="text-[10px] text-muted-foreground text-center">↑↓ навигация | Enter открыть чат</p>
            </div>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            <div className="p-2">
              <Input
                placeholder="Поиск контактов..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map((contact, index) => (
                <div key={contact.id}>
                  <div 
                    onClick={() => {
                      const existingChat = chats.find(c => c.name === contact.name);
                      if (existingChat) {
                        setSelectedChat(existingChat.id);
                        setActiveTab('chats');
                      }
                    }}
                    className={`p-3 cursor-pointer flex items-center gap-3 ${
                      index === selectedIndex ? 'bg-accent' : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.status}</p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
            <div className="p-2 bg-muted/50 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">↑↓ навигация | Enter написать</p>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 mb-3">
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  Я
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-medium">Иван Иванов</h2>
              <p className="text-sm text-muted-foreground">+7 900 123-45-67</p>
            </div>
            
            <Card className="p-3 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="User" size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Имя пользователя</p>
                  <p className="text-sm">@ivan_ivanov</p>
                </div>
              </div>
              <Separator className="mb-3" />
              <div className="flex items-center gap-3">
                <Icon name="Info" size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">О себе</p>
                  <p className="text-sm">Доступен в Telegram</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                <div className="flex items-center gap-3">
                  <Icon name="Bell" size={18} className="text-muted-foreground" />
                  <span className="text-sm">Уведомления</span>
                </div>
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </div>
              <Separator className="mb-3" />
              <div className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                <div className="flex items-center gap-3">
                  <Icon name="Lock" size={18} className="text-muted-foreground" />
                  <span className="text-sm">Конфиденциальность</span>
                </div>
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4">
            <Card className="p-3 mb-3">
              <h3 className="text-sm font-medium mb-3">Общие</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                  <div className="flex items-center gap-3">
                    <Icon name="Moon" size={18} className="text-muted-foreground" />
                    <span className="text-sm">Ночной режим</span>
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                </div>
                <Separator />
                <div className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                  <div className="flex items-center gap-3">
                    <Icon name="Languages" size={18} className="text-muted-foreground" />
                    <span className="text-sm">Язык</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Русский</span>
                    <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-3 mb-3">
              <h3 className="text-sm font-medium mb-3">Данные</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                  <div className="flex items-center gap-3">
                    <Icon name="HardDrive" size={18} className="text-muted-foreground" />
                    <span className="text-sm">Память</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">2.4 МБ</span>
                    <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                  <div className="flex items-center gap-3">
                    <Icon name="Download" size={18} className="text-muted-foreground" />
                    <span className="text-sm">Автозагрузка</span>
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <h3 className="text-sm font-medium mb-3">Справка</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                  <div className="flex items-center gap-3">
                    <Icon name="MessageCircleQuestion" size={18} className="text-muted-foreground" />
                    <span className="text-sm">FAQ</span>
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                </div>
                <Separator />
                <div className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 -m-2 rounded">
                  <div className="flex items-center gap-3">
                    <Icon name="Info" size={18} className="text-muted-foreground" />
                    <span className="text-sm">О программе</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">v1.0</span>
                    <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <nav className="border-t border-border bg-card">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab('chats');
              setSearchQuery('');
              setSelectedIndex(0);
            }}
            className={`flex-1 flex flex-col items-center py-2 transition-colors ${
              activeTab === 'chats' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="MessageSquare" size={20} />
            <span className="text-[10px] mt-1">Чаты</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('contacts');
              setSearchQuery('');
              setSelectedIndex(0);
            }}
            className={`flex-1 flex flex-col items-center py-2 transition-colors ${
              activeTab === 'contacts' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Users" size={20} />
            <span className="text-[10px] mt-1">Контакты</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              setSearchQuery('');
            }}
            className={`flex-1 flex flex-col items-center py-2 transition-colors ${
              activeTab === 'profile' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="User" size={20} />
            <span className="text-[10px] mt-1">Профиль</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('settings');
              setSearchQuery('');
            }}
            className={`flex-1 flex flex-col items-center py-2 transition-colors ${
              activeTab === 'settings' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Settings" size={20} />
            <span className="text-[10px] mt-1">Настройки</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
