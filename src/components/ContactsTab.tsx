import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Contact {
  id: number;
  name: string;
  status: string;
  online: boolean;
}

interface ContactsTabProps {
  filteredContacts: Contact[];
  searchQuery: string;
  selectedIndex: number;
  setSearchQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  onContactClick: (contact: Contact) => void;
}

const ContactsTab = ({
  filteredContacts,
  searchQuery,
  selectedIndex,
  setSearchQuery,
  setSelectedIndex,
  onContactClick,
}: ContactsTabProps) => {
  return (
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
              onClick={() => onContactClick(contact)}
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
        <p className="text-[10px] text-muted-foreground text-center">2/8 или ↑↓ навигация | Enter написать | 4/6 вкладки</p>
      </div>
    </>
  );
};

export default ContactsTab;
