
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

interface TicketDetailsProps {
  ticketId: string;
}

const TicketDetails = ({ ticketId }: TicketDetailsProps) => {
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          messages:ticket_messages(*)
        `)
        .eq("id", ticketId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const addMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("ticket_messages").insert([
        {
          ticket_id: ticketId,
          user_id: user.user?.id,
          message,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Mensagem enviada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao enviar mensagem: " + error.message);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addMessageMutation.mutate(newMessage);
    }
  };

  if (ticketLoading) {
    return <div>Carregando...</div>;
  }

  if (!ticket) {
    return <div>Chamado não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">#{ticket.number}</h2>
            <p className="text-lg">{ticket.subject}</p>
          </div>
          <Badge variant="outline">{ticket.status}</Badge>
        </div>
        <p className="mt-4 text-gray-600">{ticket.description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Mensagens</h3>
        <div className="space-y-4">
          {ticket.messages?.map((message: any) => (
            <div
              key={message.id}
              className="bg-gray-50 p-4 rounded-lg space-y-2"
            >
              <p className="text-sm text-gray-500">
                {new Date(message.created_at).toLocaleString()}
              </p>
              <p>{message.message}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" disabled={addMessageMutation.isPending}>
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
