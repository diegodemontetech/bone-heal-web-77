
import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  link?: string;
}

const NotificationsBell = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.is_admin || false);
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [profile]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", profile?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      
      if (data) {
        // Mapear os dados do banco para o formato que o componente espera
        const mappedNotifications: Notification[] = data.map(n => ({
          id: n.id,
          title: n.title || n.type || "Notificação",
          message: n.message || n.content || "",
          created_at: n.created_at,
          read: n.read || (n.read_at !== null),
          link: n.link
        }));
        
        setNotifications(mappedNotifications);
        setUnreadCount(mappedNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  const subscribeToNotifications = () => {
    // Inscrever-se a novos tickets (para admins)
    if (profile?.is_admin) {
      const ticketsSubscription = supabase
        .channel('tickets-notifications')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'support_tickets' 
          }, 
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(ticketsSubscription);
      };
    }

    // Para usuários comuns (novos mensagens em seus tickets)
    const messagesSubscription = supabase
      .channel('messages-notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'ticket_messages',
          filter: `is_from_customer=eq.false`
        }, 
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("user_id", profile?.id)
        .is("read", false);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error);
    }
  };

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
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllAsRead}
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
            <DropdownMenuItem key={notification.id} className="p-0">
              <div 
                className={`w-full p-3 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="font-medium text-sm">{notification.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
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
          ))
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="p-0">
          <Link to={isAdmin ? "/admin/settings/notifications" : "/profile/notifications"} className="w-full p-2 text-sm text-center">
            Configurações de notificação
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsBell;
