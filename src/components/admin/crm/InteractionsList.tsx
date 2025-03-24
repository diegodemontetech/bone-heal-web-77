
import { useEffect, useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Phone, Calendar, Mail, MessageCircle } from "lucide-react";

interface Interaction {
  id: string;
  interaction_type: string;
  content: string;
  interaction_date: string;
  created_at: string;
  user_id?: string;
  user?: {
    full_name: string;
  };
}

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
        .from('crm_interactions')
        .select(`
          *,
          user:user_id (
            full_name
          )
        `)
        .eq('contact_id', contactId)
        .order('interaction_date', { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error) {
      console.error('Erro ao buscar interações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      case 'call':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'stage_change':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInteractionTypeName = (type: string) => {
    switch (type) {
      case 'note': return 'Anotação';
      case 'call': return 'Ligação';
      case 'meeting': return 'Reunião';
      case 'email': return 'Email';
      case 'whatsapp': return 'WhatsApp';
      case 'stage_change': return 'Mudança de Estágio';
      default: return 'Interação';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (interactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 border rounded-md">
        <p>Nenhuma interação registrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="border rounded-md p-3 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getInteractionIcon(interaction.interaction_type)}
              <span className="font-medium text-sm">
                {getInteractionTypeName(interaction.interaction_type)}
              </span>
              {interaction.user?.full_name && (
                <span className="text-xs text-gray-500">
                  por {interaction.user.full_name}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(interaction.interaction_date), { 
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
          
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {interaction.content}
          </p>
          
          <div className="text-xs text-gray-400">
            {format(new Date(interaction.interaction_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>
      ))}
    </div>
  );
};
