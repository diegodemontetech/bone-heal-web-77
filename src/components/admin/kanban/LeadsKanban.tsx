
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CRMStage, Department, Lead } from "@/types/crm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanColumn from "./KanbanColumn";

const LeadsKanban = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        
        setStages(data || []);
        
      } catch (err: any) {
        console.error("Erro ao carregar estágios:", err);
        setError("Não foi possível carregar os estágios. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [selectedDepartment]);

  // Carregar leads (simulados por enquanto)
  useEffect(() => {
    // Dados mockados de leads para demonstração
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

  const handleChangeDepartment = (value: string) => {
    setSelectedDepartment(value);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground mb-4">Nenhum departamento configurado para o CRM</p>
        <Button asChild variant="default">
          <a href="/admin/leads/configuracoes">Configurar Departamentos</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leads - Kanban</h1>
          <p className="text-muted-foreground">Gerencie seus leads de forma visual</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="/admin/leads/configuracoes">
              Configurações
            </a>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Lead
          </Button>
        </div>
      </div>

      {departments.length > 1 && (
        <Tabs
          value={selectedDepartment || ""}
          onValueChange={handleChangeDepartment}
          className="mb-6"
        >
          <TabsList className="mb-2">
            {departments.map((department) => (
              <TabsTrigger key={department.id} value={department.id}>
                {department.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {stages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 p-4">
            <p className="text-muted-foreground mb-4">Nenhum estágio configurado para este departamento</p>
            <Button asChild>
              <a href="/admin/leads/configuracoes">Configurar Estágios</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <KanbanColumn 
              key={stage.id}
              title={stage.name}
              count={leads.filter(lead => lead.stage === stage.name).length}
              color={stage.color}
            >
              {leads
                .filter(lead => lead.stage === stage.name)
                .map(lead => (
                  <Card key={lead.id} className="mb-2 cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                      <p className="text-sm">{lead.phone}</p>
                      <div className="flex mt-2 text-xs">
                        <span className="bg-primary/10 text-primary rounded-full px-2 py-1">
                          {lead.source}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </KanbanColumn>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsKanban;
