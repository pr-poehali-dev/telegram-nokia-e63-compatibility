import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

interface ProfileSettingsTabsProps {
  activeTab: Tab;
}

const ProfileSettingsTabs = ({ activeTab }: ProfileSettingsTabsProps) => {
  if (activeTab === 'profile') {
    return (
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
    );
  }

  if (activeTab === 'settings') {
    return (
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
    );
  }

  return null;
};

export default ProfileSettingsTabs;
