
import { useState, useEffect, useRef } from "react";
import TicketsList from "./TicketsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  BellRing, 
  RefreshCw, 
  Settings 
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TicketsContentProps {
  tickets: any[] | null;
  isLoading: boolean;
  agents: any[] | null;
  onAssignTicket?: (ticketId: string, agentId: string) => Promise<void>;
  onUpdateStatus?: (ticketId: string, status: string) => Promise<void>;
}

const TicketsContent = ({ 
  tickets, 
  isLoading, 
  agents,
  onAssignTicket,
  onUpdateStatus
}: TicketsContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSLASettings, setShowSLASettings] = useState(false);
  const [slaHours, setSlaHours] = useState(24);
  const previousTicketsLength = useRef<number | null>(null);

  // Configurar um intervalo para atualizar os tickets a cada 3 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      checkSLAViolations();
    }, 180000); // 3 minutos em milissegundos
    
    setRefreshInterval(interval as unknown as number);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Detectar novos tickets
  useEffect(() => {
    if (tickets && previousTicketsLength.current !== null) {
      if (tickets.length > previousTicketsLength.current) {
        toast("Novos tickets recebidos", {
          description: `${tickets.length - previousTicketsLength.current} novo(s) ticket(s) adicionado(s)`,
        });
      }
    }
    
    if (tickets) {
      previousTicketsLength.current = tickets.length;
    }
  }, [tickets]);
  
  // Verificar violações de SLA
  const checkSLAViolations = () => {
    if (!tickets) return;
    setIsRefreshing(true);
    
    const currentTime = new Date().getTime();
    const ticketsWithSLAViolation = tickets.filter(ticket => {
      if (ticket.status === 'resolved' || ticket.status === 'closed') return false;
      
      const lastUpdateTime = new Date(ticket.updated_at || ticket.created_at).getTime();
      const hoursSinceLastUpdate = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
      
      return hoursSinceLastUpdate > slaHours;
    });
    
    if (ticketsWithSLAViolation.length > 0) {
      toast(`${ticketsWithSLAViolation.length} tickets com SLA comprometido`, {
        description: "Existem tickets que precisam de atenção urgente.",
        variant: "destructive",
      });
    } else {
      toast("Verificação de SLA concluída", {
        description: "Todos os tickets estão dentro do prazo de atendimento.",
      });
    }
    
    setTimeout(() => setIsRefreshing(false), 500);
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
      medium: 'Normal',
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
      const customerNameMatch = ticket.customer?.full_name?.toLowerCase().includes(searchLower);
      const customerEmailMatch = ticket.customer?.email?.toLowerCase().includes(searchLower);
      const numberMatch = String(ticket.id).includes(searchLower);
      const descriptionMatch = ticket.description?.toLowerCase().includes(searchLower);
      
      return subjectMatch || customerNameMatch || customerEmailMatch || numberMatch || descriptionMatch;
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
            disabled={isRefreshing}
            className="flex items-center"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <BellRing className="h-4 w-4 mr-2" />
            )}
            Verificar SLA
          </Button>
          
          <Dialog open={showSLASettings} onOpenChange={setShowSLASettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Config. SLA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Configurações de SLA</DialogTitle>
                <DialogDescription>
                  Configure o tempo limite para atendimento de tickets.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sla-hours" className="col-span-3">
                    Tempo máximo para resposta (horas)
                  </Label>
                  <Input
                    id="sla-hours"
                    type="number"
                    value={slaHours}
                    onChange={(e) => setSlaHours(parseInt(e.target.value))}
                    className="col-span-1"
                    min={1}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={() => {
                    toast("Configurações salvas", {
                      description: `SLA definido para ${slaHours} horas`,
                    });
                    setShowSLASettings(false);
                  }}
                >
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
            onAssign={onAssignTicket}
            onStatusChange={onUpdateStatus}
            agents={agents || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketsContent;
