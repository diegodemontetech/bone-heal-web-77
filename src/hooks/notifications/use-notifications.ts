
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  link?: string;
}

export const useNotifications = () => {
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

  return {
    notifications,
    unreadCount,
    isAdmin,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead
  };
};
