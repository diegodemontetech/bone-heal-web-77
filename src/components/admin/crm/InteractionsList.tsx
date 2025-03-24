
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Interaction } from "@/types/crm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const InteractionsList = ({ contactId }: { contactId: string }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [interactionType, setInteractionType] = useState("call");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchInteractions();
  }, [contactId]);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_interactions')
        .select('*, user(*)')
        .eq('contact_id', contactId)
        .order('interaction_date', { ascending: false });

      if (error) {
        throw error;
      }

      // Mapear os dados para o formato Interaction
      const formattedInteractions: Interaction[] = data.map((interaction: any) => ({
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
      toast.error("Não foi possível carregar as interações");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInteraction = async () => {
    if (!content.trim()) {
      toast.error("Por favor, adicione um conteúdo para a interação");
      return;
    }

    try {
      setSending(true);
      const { data, error } = await supabase
        .from('crm_interactions')
        .insert({
          interaction_type: interactionType,
          content,
          contact_id: contactId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        throw error;
      }

      toast.success("Interação registrada com sucesso");
      setContent("");
      fetchInteractions();
      
      // Atualizar o last_interaction do contato
      await supabase
        .from('crm_contacts')
        .update({ last_interaction: new Date().toISOString() })
        .eq('id', contactId);
        
    } catch (error) {
      console.error("Erro ao adicionar interação:", error);
      toast.error("Falha ao registrar interação");
    } finally {
      setSending(false);
    }
  };

  const getInteractionTypeLabel = (type: string) => {
    switch (type) {
      case 'call': return 'Ligação';
      case 'email': return 'E-mail';
      case 'meeting': return 'Reunião';
      case 'whatsapp': return 'WhatsApp';
      case 'note': return 'Anotação';
      default: return 'Outro';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <Select
              value={interactionType}
              onValueChange={setInteractionType}
              disabled={sending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de interação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Ligação</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="meeting">Reunião</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="note">Anotação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-8">
            <Textarea
              placeholder="Descreva a interação..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={sending}
              rows={2}
            />
          </div>
        </div>
        <Button
          onClick={handleAddInteraction}
          disabled={!content.trim() || sending}
          className="w-full"
        >
          {sending ? "Salvando..." : "Adicionar Interação"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando interações...</div>
      ) : interactions.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">Nenhuma interação registrada</div>
      ) : (
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <div 
              key={interaction.id} 
              className="p-3 rounded border bg-card"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    {getInteractionTypeLabel(interaction.interaction_type)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(interaction.interaction_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {interaction.user?.full_name || 'Usuário desconhecido'}
                </span>
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">{interaction.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
