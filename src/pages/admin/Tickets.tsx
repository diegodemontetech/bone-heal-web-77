
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle,
  Clock,
  MessageSquare,
  Loader2, 
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/admin/Layout";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryLabels: Record<string, string> = {
  "technical": "Suporte Técnico",
  "financial": "Financeiro",
  "product": "Dúvida sobre Produto",
  "order": "Pedido",
  "other": "Outro"
};

const AdminTickets = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin-tickets", statusFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          customer:customer_id(full_name, email),
          ticket_messages(id)
        `)
        .order('created_at', { ascending: false });
      
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      if (searchQuery) {
        query = query.or(`subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="warning">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="info">Em Andamento</Badge>;
      case "resolved":
        return <Badge variant="success">Resolvido</Badge>;
      case "closed":
        return <Badge>Fechado</Badge>;
      default:
        return <Badge>Aberto</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>;
      case "normal":
        return <Badge variant="warning">Normal</Badge>;
      case "low":
        return <Badge variant="secondary">Baixa</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Tickets de Suporte</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar tickets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tickets</SelectItem>
              <SelectItem value="open">Abertos</SelectItem>
              <SelectItem value="in_progress">Em andamento</SelectItem>
              <SelectItem value="resolved">Resolvidos</SelectItem>
              <SelectItem value="closed">Fechados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !tickets?.length ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Nenhum ticket encontrado</h3>
            <p className="text-gray-500">
              Não há tickets correspondentes aos critérios de busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{ticket.subject}</h3>
                      <span className="ml-2 text-xs text-gray-500">
                        #{ticket.number}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-1 line-clamp-1">{ticket.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span className="inline-flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(ticket.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                      <span className="inline-flex items-center mr-4">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {ticket.ticket_messages.length} mensagens
                      </span>
                      {ticket.category && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {categoryLabels[ticket.category] || ticket.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex space-x-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {ticket.customer?.full_name}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => window.open(`/support/tickets/${ticket.id}`, '_blank')}
                  >
                    Ver detalhes
                  </Button>
                  
                  {ticket.status === 'open' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Assumir ticket
                    </Button>
                  )}
                  
                  {ticket.status === 'in_progress' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como resolvido
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;
