
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lead, CRMStage, Department } from "@/types/crm";
import { useSearchParams } from "react-router-dom";

interface UseKanbanDataReturn {
  loading: boolean;
  error: string | null;
  departments: Department[];
  stages: CRMStage[];
  activeDepartment: string;
  groupedLeads: { [stageId: string]: Lead[] };
  setActiveDepartment: (departmentId: string) => void;
  handleLeadMove: (leadId: string, newStageId: string) => Promise<void>;
}

export const useKanbanData = (): UseKanbanDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [activeDepartment, setActiveDepartment] = useState<string>("");
  const [groupedLeads, setGroupedLeads] = useState<{ [stageId: string]: Lead[] }>({});
  const [searchParams, setSearchParams] = useSearchParams();

  // Load Active Department from URL
  useEffect(() => {
    const urlDepartment = searchParams.get("department");
    if (urlDepartment) {
      setActiveDepartment(urlDepartment);
    }
  }, [searchParams]);

  // Update URL when Active Department changes
  useEffect(() => {
    if (activeDepartment) {
      searchParams.set("department", activeDepartment);
      setSearchParams(searchParams);
    }
  }, [activeDepartment, setSearchParams, searchParams]);

  const fetchDepartments = useCallback(async () => {
    try {
      const { data: departmentsData, error: departmentsError } = await supabase
        .from("crm_departments")
        .select("*")
        .order("name");

      if (departmentsError) {
        throw new Error(`Erro ao buscar departamentos: ${departmentsError.message}`);
      }

      if (!departmentsData || departmentsData.length === 0) {
        setError("Nenhum departamento encontrado. Configure seus departamentos.");
        setLoading(false);
        return;
      }

      setDepartments(departmentsData);
      
      // Set initial active department to the first one fetched, if not already set
      if (!activeDepartment && departmentsData.length > 0) {
        setActiveDepartment(departmentsData[0].id);
      }
      
    } catch (err: any) {
      setError(err.message || "Erro ao buscar departamentos.");
    }
  }, [activeDepartment]);

  const fetchStages = useCallback(async (departmentId: string) => {
    try {
      const { data: stagesData, error: stagesError } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("department_id", departmentId)
        .order("order");

      if (stagesError) {
        throw new Error(`Erro ao buscar estágios: ${stagesError.message}`);
      }

      if (!stagesData || stagesData.length === 0) {
        setStages([]);
        setGroupedLeads({});
        return;
      }

      // Adicione uma verificação para garantir que pipeline_id existe
      const stagesWithPipeline = stagesData.map(stage => ({ 
        ...stage, 
        pipeline_id: "pipeline_id" in stage ? stage.pipeline_id : "" 
      }));

      setStages(stagesWithPipeline as CRMStage[]);
      
      // Fetch leads after stages are loaded
      await fetchLeads(stagesWithPipeline.map(stage => stage.id));

    } catch (err: any) {
      setError(err.message || "Erro ao buscar estágios.");
    }
  }, []);

  const fetchLeads = useCallback(async (stageIds: string[]) => {
    try {
      // Verifique se a tabela leads existe
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .in("stage", stageIds);

      if (leadsError) {
        throw new Error(`Erro ao buscar leads: ${leadsError.message}`);
      }

      if (!leadsData) {
        setGroupedLeads({});
        return;
      }

      // Group leads by stage
      const grouped = leadsData.reduce((acc: { [stageId: string]: Lead[] }, lead: Lead) => {
        acc[lead.stage] = acc[lead.stage] || [];
        acc[lead.stage].push(lead);
        return acc;
      }, {});

      setGroupedLeads(grouped);

    } catch (err: any) {
      setError(err.message || "Erro ao buscar leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchDepartments()
      .then(() => {
        if (activeDepartment) {
          return fetchStages(activeDepartment);
        }
      })
      .catch((err: any) => {
        setError(err.message || "Erro ao inicializar dados.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchDepartments, fetchStages, activeDepartment]);

  const setActiveDepartmentHandler = (departmentId: string) => {
    setActiveDepartment(departmentId);
  };

  const handleLeadMove = async (leadId: string, newStageId: string) => {
    try {
      setLoading(true);

      const { error: updateError } = await supabase
        .from("leads")
        .update({ stage: newStageId })
        .eq("id", leadId);

      if (updateError) {
        throw new Error(`Erro ao mover lead: ${updateError.message}`);
      }

      // Update local state
      setGroupedLeads(prevGroupedLeads => {
        const newGroupedLeads = { ...prevGroupedLeads };

        // Find the lead in the current stage and remove it
        for (const stageId in newGroupedLeads) {
          newGroupedLeads[stageId] = newGroupedLeads[stageId].filter(lead => lead.id !== leadId);
        }

        // Add the lead to the new stage
        const leadToMove = Object.values(prevGroupedLeads)
          .flat()
          .find(lead => lead.id === leadId);

        if (leadToMove) {
          newGroupedLeads[newStageId] = newGroupedLeads[newStageId] || [];
          newGroupedLeads[newStageId].push({ ...leadToMove, stage: newStageId });
        }

        return newGroupedLeads;
      });

      toast.success("Lead movido com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao mover lead.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    departments,
    stages,
    activeDepartment,
    groupedLeads,
    setActiveDepartment: setActiveDepartmentHandler,
    handleLeadMove,
  };
};
