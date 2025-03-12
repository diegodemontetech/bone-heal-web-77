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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const LeadsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads", selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("contact_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedStatus && selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
      
      return data;
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

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Select
          value={selectedStatus || "all"}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-48">
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

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>
                  {lead.source === "whatsapp_widget" ? "WhatsApp" : "Formulário"}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadsPage;
