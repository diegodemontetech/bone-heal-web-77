
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Notification } from "@/hooks/notifications/use-notifications";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <DropdownMenuItem key={notification.id} className="p-0">
      <div 
        className={`w-full p-3 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
        onClick={() => onMarkAsRead(notification.id)}
      >
        <div className="font-medium text-sm">{notification.title}</div>
        <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(notification.created_at)}
          </span>
          {!notification.read && (
            <Badge variant="secondary" className="text-xs">Nova</Badge>
          )}
        </div>
        {notification.link && (
          <Link 
            to={notification.link} 
            className="text-xs text-primary mt-1 block"
          >
            Ver detalhes
          </Link>
        )}
      </div>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
