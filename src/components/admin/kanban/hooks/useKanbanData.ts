
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CRMStage } from "@/types/crm";
import { toast } from "sonner";

export interface Department {
  id: string;
  name: string;
}

export const useKanbanData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [activeDepartment, setActiveDepartment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDepartments();
    fetchStages();
  }, []);

  // Selecionar primeiro departamento automaticamente após carregamento
  useEffect(() => {
    if (departments.length > 0 && !activeDepartment) {
      setActiveDepartment(departments[0].id);
    }
  }, [departments, activeDepartment]);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from("crm_departments")
        .select("*")
        .order("name");

      if (error) throw error;

      if (data) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Erro ao carregar departamentos:", error);
      toast.error("Não foi possível carregar os departamentos");
    }
  };

  const fetchStages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("crm_stages")
        .select("*")
        .order("order");

      if (error) throw error;

      if (data) {
        // Garantir que pipeline_id sempre existe, mesmo se vier null do banco
        const stagesWithPipelineId = data.map(stage => ({
          ...stage,
          pipeline_id: stage.pipeline_id || ""
        })) as CRMStage[];
        setStages(stagesWithPipelineId);
      }
    } catch (error) {
      console.error("Erro ao carregar estágios:", error);
      toast.error("Não foi possível carregar os estágios");
    } finally {
      setLoading(false);
    }
  };

  const getStagesByDepartment = (departmentId: string) => {
    return stages.filter(stage => stage.department_id === departmentId)
      .sort((a, b) => a.order - b.order);
  };

  return {
    departments,
    stages,
    activeDepartment,
    setActiveDepartment,
    loading,
    getStagesByDepartment
  };
};
