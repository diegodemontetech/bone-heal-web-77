
import { useState, useEffect } from "react";
import TicketsList from "./TicketsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, BellRing, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketsContentProps {
  tickets: any[] | null;
  isLoading: boolean;
  agents: any[] | null;
}

const TicketsContent = ({ tickets, isLoading, agents }: TicketsContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const { toast } = useToast();

  // Configurar um intervalo para atualizar os tickets a cada 3 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      // Este código simularia uma chamada para refresh
      checkSLAViolations();
    }, 180000); // 3 minutos em milissegundos
    
    setRefreshInterval(interval as unknown as number);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);
  
  // Verificar violações de SLA
  const checkSLAViolations = () => {
    if (!tickets) return;
    
    const currentTime = new Date().getTime();
    const ticketsWithSLAViolation = tickets.filter(ticket => {
      if (ticket.status === 'resolved' || ticket.status === 'closed') return false;
      
      const lastUpdateTime = new Date(ticket.updated_at || ticket.created_at).getTime();
      const hoursSinceLastUpdate = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
      
      return hoursSinceLastUpdate > 24;
    });
    
    if (ticketsWithSLAViolation.length > 0) {
      toast({
        title: `${ticketsWithSLAViolation.length} tickets com SLA comprometido`,
        description: "Existem tickets que precisam de atenção urgente.",
        variant: "destructive",
      });
    }
  };

  const categoryLabels = {
    status: {
      open: 'Aberto',
      in_progress: 'Em andamento',
      resolved: 'Resolvido',
      closed: 'Fechado'
    },
    priority: {
      low: 'Baixa',
      normal: 'Normal',
      high: 'Alta',
      urgent: 'Urgente'
    },
    category: {
      support: 'Suporte Técnico',
      sales: 'Vendas',
      logistics: 'Entregas (Logística)',
      financial: 'Financeiro',
      general: 'Geral'
    }
  };

  // Filtrar tickets com base na aba ativa e no termo de pesquisa
  const filteredTickets = tickets?.filter(ticket => {
    // Filtrar por status
    if (activeTab !== 'all' && ticket.status !== activeTab) {
      return false;
    }

    // Filtrar por termo de pesquisa
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      const subjectMatch = ticket.subject?.toLowerCase().includes(searchLower);
      const customerMatch = ticket.customer?.full_name?.toLowerCase().includes(searchLower);
      const numberMatch = ticket.number?.toString().includes(searchLower);
      
      return subjectMatch || customerMatch || numberMatch;
    }

    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Pesquisar tickets..."
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkSLAViolations}
            className="flex items-center"
          >
            <BellRing className="h-4 w-4 mr-2" />
            Verificar SLA
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="open">Abertos</TabsTrigger>
          <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          <TabsTrigger value="closed">Fechados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <TicketsList 
            tickets={filteredTickets || []} 
            isLoading={isLoading} 
            categoryLabels={categoryLabels}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketsContent;
