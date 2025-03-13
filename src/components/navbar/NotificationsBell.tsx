
import { Bell, BellDot } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationsList from "./notifications/NotificationsList";
import { useNotifications } from "@/hooks/notifications/use-notifications";

const NotificationsBell = () => {
  const { 
    notifications, 
    unreadCount, 
    isAdmin, 
    handleMarkAsRead, 
    handleMarkAllAsRead 
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full p-2" size="icon">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 text-xs h-5 min-w-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <NotificationsList 
        notifications={notifications}
        unreadCount={unreadCount}
        isAdmin={isAdmin}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </DropdownMenu>
  );
};

export default NotificationsBell;
