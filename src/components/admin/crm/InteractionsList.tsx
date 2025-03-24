
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Interaction } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Phone, Calendar, Mail, MessageCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InteractionsListProps {
  contactId: string;
}

export const InteractionsList = ({ contactId }: InteractionsListProps) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchInteractions();
  }, [contactId]);
  
  const fetchInteractions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("crm_interactions")
        .select("*, user:user_id(full_name)")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Mapear para o formato esperado
      const formattedInteractions: Interaction[] = (data || []).map(interaction => ({
        id: interaction.id,
        interaction_type: interaction.interaction_type,
        content: interaction.content,
        interaction_date: interaction.interaction_date,
        created_at: interaction.created_at,
        user_id: interaction.user_id,
        contact_id: interaction.contact_id,
        user: interaction.user
      }));
      
      setInteractions(formattedInteractions);
    } catch (error) {
      console.error("Erro ao buscar interações:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteInteraction = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta interação?")) return;
    
    try {
      const { error } = await supabase
        .from("crm_interactions")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setInteractions(prev => prev.filter(interaction => interaction.id !== id));
      toast.success("Interação excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir interação:", error);
      toast.error("Erro ao excluir interação");
    }
  };
  
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "note":
        return <User className="h-4 w-4 text-blue-500" />;
      case "call":
        return <Phone className="h-4 w-4 text-green-500" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-orange-500" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando interações...</p>
      </div>
    );
  }
  
  if (interactions.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Nenhuma interação registrada</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {interactions.map(interaction => (
        <div 
          key={interaction.id} 
          className="p-4 border rounded-md bg-card"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getInteractionIcon(interaction.interaction_type)}
              <div>
                <p className="text-sm font-medium">
                  {interaction.interaction_type.charAt(0).toUpperCase() + interaction.interaction_type.slice(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(interaction.created_at), { addSuffix: true, locale: ptBR })}
                  {interaction.user?.full_name && ` • ${interaction.user.full_name}`}
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              onClick={() => deleteInteraction(interaction.id)}
            >
              <Trash className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <p className="mt-2 text-sm whitespace-pre-wrap">{interaction.content}</p>
        </div>
      ))}
    </div>
  );
};
