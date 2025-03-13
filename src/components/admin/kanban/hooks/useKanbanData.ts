
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CRMStage, Department, Lead } from "@/types/crm";
import { toast } from "sonner";

export const useKanbanData = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [groupedLeads, setGroupedLeads] = useState<Record<string, Lead[]>>({});

  // Carregar departamentos
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from("crm_departments")
          .select("*")
          .order("name");

        if (error) throw error;
        
        if (data && data.length > 0) {
          setDepartments(data);
          setSelectedDepartment(data[0].id);
        }
      } catch (err: any) {
        console.error("Erro ao carregar departamentos:", err);
        setError("Não foi possível carregar os departamentos. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Carregar estágios quando um departamento é selecionado
  useEffect(() => {
    if (!selectedDepartment) return;

    const fetchStages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("crm_stages")
          .select("*")
          .eq("department_id", selectedDepartment)
          .order("order");

        if (error) throw error;
        
        if (data) {
          // Garantir que todos os estágios tenham pipeline_id
          const stagesWithPipelineId = data.map(stage => ({
            ...stage,
            pipeline_id: stage.pipeline_id || ""
          })) as CRMStage[];
          
          setStages(stagesWithPipelineId);
        }
        
      } catch (err: any) {
        console.error("Erro ao carregar estágios:", err);
        setError("Não foi possível carregar os estágios. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [selectedDepartment]);

  // Carregar leads (mock)
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: "1",
        name: "João Silva",
        email: "joao@exemplo.com",
        phone: "(11) 98765-4321",
        status: "novo",
        stage: "Novo",
        source: "site",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_contact: new Date().toISOString(),
        needs_human: false
      },
      {
        id: "2",
        name: "Maria Oliveira",
        email: "maria@exemplo.com",
        phone: "(11) 91234-5678",
        status: "contatado",
        stage: "Contatado",
        source: "whatsapp",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_contact: new Date().toISOString(),
        needs_human: true
      },
      {
        id: "3",
        name: "Carlos Pereira",
        email: "carlos@exemplo.com",
        phone: "(21) 99876-5432",
        status: "proposta",
        stage: "Proposta",
        source: "indicação",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_contact: new Date().toISOString(),
        needs_human: false
      }
    ];
    
    setLeads(mockLeads);
  }, []);

  // Agrupar leads por estágio
  useEffect(() => {
    if (stages.length === 0) return;

    const grouped: Record<string, Lead[]> = {};
    
    // Inicializar todos os estágios com arrays vazios
    stages.forEach(stage => {
      grouped[stage.id] = [];
    });

    // Distribuir leads nos estágios apropriados
    leads.forEach(lead => {
      // Encontrar o estágio pelo nome (em uma implementação real, usaríamos o ID)
      const stage = stages.find(s => s.name === lead.stage);
      if (stage) {
        grouped[stage.id] = [...(grouped[stage.id] || []), lead];
      }
    });

    setGroupedLeads(grouped);
  }, [leads, stages]);

  const handleChangeDepartment = (value: string) => {
    setSelectedDepartment(value);
  };

  const handleLeadMove = (
    leadId: string, 
    sourceStageId: string, 
    destinationStageId: string,
    destinationIndex: number
  ) => {
    // Encontrar o lead que está sendo movido
    const leadToMove = leads.find(lead => lead.id === leadId);
    if (!leadToMove) return;

    // Encontrar o nome do estágio de destino
    const destinationStage = stages.find(stage => stage.id === destinationStageId);
    if (!destinationStage) return;

    // Atualizar o estado local primeiro (otimismo UI)
    const newGroupedLeads = { ...groupedLeads };
    
    // Remover do estágio de origem
    newGroupedLeads[sourceStageId] = newGroupedLeads[sourceStageId].filter(
      lead => lead.id !== leadId
    );
    
    // Adicionar ao estágio de destino
    const updatedLead = { ...leadToMove, stage: destinationStage.name };
    newGroupedLeads[destinationStageId] = [
      ...newGroupedLeads[destinationStageId],
      updatedLead
    ];
    
    setGroupedLeads(newGroupedLeads);
    
    // Atualizar a lista completa de leads
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, stage: destinationStage.name } 
          : lead
      )
    );

    // Em uma implementação real, aqui você enviaria a atualização para o backend
    toast.success(`Lead movido para ${destinationStage.name}`);
  };

  return {
    loading,
    error,
    departments,
    stages,
    selectedDepartment,
    groupedLeads,
    handleChangeDepartment,
    handleLeadMove
  };
};
