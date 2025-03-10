
import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Phone, MapPin, Calendar, User } from "lucide-react";
import { LeadDrawer } from "./LeadDrawer";
import { KanbanColumn } from "./KanbanColumn";
import { useLeadsQuery } from "./hooks/useLeadsQuery";
import { useUpdateLeadStatus } from "./hooks/useUpdateLeadStatus";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Definição das colunas do Kanban
const COLUNAS_NEGOCIACAO = [
  { id: "negociacao", title: "Negociação" },
  { id: "primeira_compra", title: "Primeira Compra" },
  { id: "novo_orcamento", title: "Novo Orçamento" },
  { id: "pedido", title: "Pedido" },
  { id: "pedido_pago", title: "Pedido Pago" }
];

const COLUNAS_CARTEIRA = [
  { id: "ativos", title: "Clientes Ativos" },
  { id: "esfriando", title: "Clientes Esfriando" },
  { id: "em_negociacao", title: "Em Negociação" }
];

export const LeadsKanban = () => {
  const [pipelineAtivo, setPipelineAtivo] = useState<"negociacao" | "carteira">("negociacao");
  const [leadSelecionado, setLeadSelecionado] = useState<any | null>(null);
  const [drawerAberto, setDrawerAberto] = useState(false);
  
  const { leads, isLoading, refetch } = useLeadsQuery();
  const { updateLeadStatus } = useUpdateLeadStatus();

  const colunas = pipelineAtivo === "negociacao" ? COLUNAS_NEGOCIACAO : COLUNAS_CARTEIRA;

  const getLeadsPorStatus = (status: string) => {
    return leads?.filter(lead => lead.status === status) || [];
  };

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const novoStatus = destination.droppableId;
    
    // Atualizar status do lead no banco de dados
    await updateLeadStatus(draggableId, novoStatus);
    refetch();
  }, [updateLeadStatus, refetch]);

  const handleAbrirDrawer = (lead: any) => {
    setLeadSelecionado(lead);
    setDrawerAberto(true);
  };

  const handleFecharDrawer = () => {
    setDrawerAberto(false);
    setLeadSelecionado(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Leads</h1>
        
        <div className="bg-gray-100 p-1 rounded-lg">
          <button 
            className={`px-4 py-2 rounded-md ${pipelineAtivo === "negociacao" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setPipelineAtivo("negociacao")}
          >
            Pipeline de Negociação
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${pipelineAtivo === "carteira" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setPipelineAtivo("carteira")}
          >
            Carteira de Clientes
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {colunas.map(coluna => (
            <div key={coluna.id} className="bg-gray-100 p-4 rounded-lg h-[70vh] animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {colunas.map(coluna => (
              <KanbanColumn 
                key={coluna.id}
                id={coluna.id}
                title={coluna.title}
                totalCards={getLeadsPorStatus(coluna.id).length}
              >
                {getLeadsPorStatus(coluna.id).map((lead, index) => (
                  <Draggable key={lead.id} draggableId={lead.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 mb-3 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleAbrirDrawer(lead)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">{lead.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {lead.source === "whatsapp_widget" ? "WhatsApp" : "Formulário"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{lead.phone}</span>
                          </div>
                          
                          {lead.city && lead.state && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{lead.city}, {lead.state}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDistanceToNow(new Date(lead.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          </div>
                          
                          {lead.assigned_to && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{lead.assigned_to}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </KanbanColumn>
            ))}
          </div>
        </DragDropContext>
      )}

      <LeadDrawer 
        open={drawerAberto} 
        onClose={handleFecharDrawer} 
        lead={leadSelecionado}
        onLeadUpdate={refetch}
      />
    </div>
  );
};

export default LeadsKanban;
