
import { 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/hooks/notifications/use-notifications";

interface NotificationsListProps {
  notifications: Notification[];
  unreadCount: number;
  isAdmin: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsList = ({
  notifications,
  unreadCount,
  isAdmin,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationsListProps) => {
  return (
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuLabel className="flex items-center justify-between">
        <span>Notificações</span>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs h-7"
          >
            Marcar todas como lidas
          </Button>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          Nenhuma notificação
        </div>
      ) : (
        notifications.map(notification => (
          <NotificationItem 
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))
      )}
      
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="p-0">
        <Link to={isAdmin ? "/admin/settings/notifications" : "/profile/notifications"} className="w-full p-2 text-sm text-center">
          Configurações de notificação
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default NotificationsList;
