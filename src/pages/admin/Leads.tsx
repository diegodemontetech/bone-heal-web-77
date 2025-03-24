
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import Layout from '@/components/admin/Layout';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, Phone, Mail } from "lucide-react";

// Define a proper type for the lead object
interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string; // Make email optional
  reason: string;
  source: string;
  status: string;
  created_at: string;
  message?: string; // Make message optional
}

const LeadsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ["leads", selectedStatus, selectedSource],
    queryFn: async () => {
      let query = supabase
        .from("contact_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedStatus && selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }
      
      if (selectedSource && selectedSource !== "all") {
        query = query.eq("source", selectedSource);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
      
      return data as Lead[];
    },
  });

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) {
        console.error("Error updating lead status:", error);
        toast("Erro ao atualizar status do lead", {
          description: error.message,
          duration: 3000,
          important: true,
        });
      } else {
        toast.success("Status do lead atualizado com sucesso");
        refetch();
      }
    } catch (error) {
      console.error("Error:", error);
      toast("Erro ao atualizar status do lead", {
        description: "Ocorreu um erro ao tentar atualizar o status",
        duration: 3000,
        important: true,
      });
    }
  };

  const convertToCRMContact = async (lead: Lead) => {
    try {
      // Get the first stage ID of the Hunting pipeline
      const { data: stageData } = await supabase
        .from('crm_stages')
        .select('id')
        .eq('pipeline_id', 'a1f15c3f-5c88-4a9a-b867-6107e160f045') // Hunting Ativo pipeline ID
        .order('order_index', { ascending: true })
        .limit(1);
      
      if (stageData && stageData.length > 0) {
        const stageId = stageData[0].id;
        
        // Create CRM contact
        const { data, error } = await supabase.from('crm_contacts').insert({
          full_name: lead.name,
          whatsapp: lead.phone,
          email: lead.email || null,
          pipeline_id: 'a1f15c3f-5c88-4a9a-b867-6107e160f045', // Hunting Ativo pipeline ID
          stage_id: stageId,
          observations: `Convertido de lead. Fonte: ${lead.source === 'whatsapp_widget' ? 'WhatsApp' : 'Formulário de Contato'}. Motivo: ${lead.reason}. Mensagem: ${lead.message || ''}`,
          client_type: 'Lead'
        }).select();
        
        if (error) {
          throw error;
        }
        
        // Mark lead as contacted
        await updateLeadStatus(lead.id, 'contacted');
        
        toast.success("Lead convertido para CRM com sucesso");
        
        // Navigate to CRM with the new contact
        if (data && data.length > 0) {
          navigate('/admin/crm/hunting');
        }
      }
    } catch (error) {
      console.error('Error converting lead to CRM contact:', error);
      toast.error("Erro ao converter lead para CRM");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>
              Gerencie contatos de potenciais clientes vindos do site e WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Status</label>
                  <Select
                    value={selectedStatus || "all"}
                    onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="new">Novo</SelectItem>
                      <SelectItem value="contacted">Contatado</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Origem</label>
                  <Select
                    value={selectedSource || "all"}
                    onValueChange={(value) => setSelectedSource(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="whatsapp_widget">WhatsApp</SelectItem>
                      <SelectItem value="contact_form">Formulário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/admin/crm/hunting')}
                variant="default"
              >
                Ver no CRM
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhum lead encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads?.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {format(new Date(lead.created_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                          <div className="text-xs text-gray-500">
                            {format(new Date(lead.created_at), "HH:mm", {
                              locale: ptBR,
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span>{lead.phone}</span>
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-sm">{lead.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.source === "whatsapp_widget" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {lead.source === "whatsapp_widget" ? "WhatsApp" : "Formulário"}
                          </span>
                        </TableCell>
                        <TableCell>{lead.reason}</TableCell>
                        <TableCell>
                          <Select
                            value={lead.status}
                            onValueChange={(value) => updateLeadStatus(lead.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Novo</SelectItem>
                              <SelectItem value="contacted">Contatado</SelectItem>
                              <SelectItem value="closed">Fechado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // View message and details
                                toast(`Mensagem: ${lead.message || 'Não informada'}`, {
                                  description: `Lead criado em ${format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", {
                                    locale: ptBR,
                                  })}`,
                                  duration: 5000,
                                });
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => convertToCRMContact(lead)}
                            >
                              Converter para CRM
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LeadsPage;
