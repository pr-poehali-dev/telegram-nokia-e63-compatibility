import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import ChatWindow from '@/components/ChatWindow';
import ChatsTab from '@/components/ChatsTab';
import ContactsTab from '@/components/ContactsTab';
import ProfileSettingsTabs from '@/components/ProfileSettingsTabs';

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
  const [isWriting, setIsWriting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (selectedChat && !isWriting) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedChat(null);
        setIsWriting(false);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsWriting(true);
        setTimeout(() => textareaRef.current?.focus(), 0);
        return;
      }
      if (e.key === 'p' || e.key === 'P' || e.key === 'з' || e.key === 'З') {
        e.preventDefault();
        fileInputRef.current?.click();
        return;
      }
      return;
    }

    if (isWriting) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsWriting(false);
        setMessageText('');
        return;
      }
      return;
    }

    const currentList = activeTab === 'chats' ? filteredChats : activeTab === 'contacts' ? filteredContacts : [];
    
    if (e.key === 'ArrowDown' || e.key === '2') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, currentList.length - 1));
    } else if (e.key === 'ArrowUp' || e.key === '8') {
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
    } else if (e.key === '4') {
      e.preventDefault();
      const tabs: Tab[] = ['chats', 'contacts', 'profile', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      setActiveTab(tabs[prevIndex]);
      setSelectedIndex(0);
    } else if (e.key === '6') {
      e.preventDefault();
      const tabs: Tab[] = ['chats', 'contacts', 'profile', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);
      const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      setActiveTab(tabs[nextIndex]);
      setSelectedIndex(0);
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
    setIsWriting(false);
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

  const handleContactClick = (contact: Contact) => {
    const existingChat = chats.find(c => c.name === contact.name);
    if (existingChat) {
      setSelectedChat(existingChat.id);
      setActiveTab('chats');
    }
  };

  const currentChat = chats.find(c => c.id === selectedChat);
  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

  if (selectedChat && currentChat) {
    return (
      <ChatWindow
        currentChat={currentChat}
        currentMessages={currentMessages}
        messageText={messageText}
        isWriting={isWriting}
        setMessageText={setMessageText}
        setIsWriting={setIsWriting}
        setSelectedChat={setSelectedChat}
        handleSendMessage={handleSendMessage}
        handleImageUpload={handleImageUpload}
        handleKeyDown={handleKeyDown}
        textareaRef={textareaRef}
        fileInputRef={fileInputRef}
      />
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
          <ChatsTab
            filteredChats={filteredChats}
            searchQuery={searchQuery}
            selectedIndex={selectedIndex}
            setSearchQuery={setSearchQuery}
            setSelectedIndex={setSelectedIndex}
            setSelectedChat={setSelectedChat}
          />
        )}

        {activeTab === 'contacts' && (
          <ContactsTab
            filteredContacts={filteredContacts}
            searchQuery={searchQuery}
            selectedIndex={selectedIndex}
            setSearchQuery={setSearchQuery}
            setSelectedIndex={setSelectedIndex}
            onContactClick={handleContactClick}
          />
        )}

        {(activeTab === 'profile' || activeTab === 'settings') && (
          <ProfileSettingsTabs activeTab={activeTab} />
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
