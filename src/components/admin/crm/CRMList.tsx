
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Contact } from "@/types/crm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CRMListProps {
  pipelineId: string | null;
  onContactClick: (contact: Contact) => void;
}

export const CRMList = ({ pipelineId, onContactClick }: CRMListProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pipelineId) {
      fetchContacts();
    }
  }, [pipelineId]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("crm_contacts")
        .select("*, stage:stage_id(name, color)")
        .eq("pipeline_id", pipelineId);

      if (error) throw error;

      // Map to Contact type
      const mappedContacts: Contact[] = data.map(contact => ({
        id: contact.id,
        full_name: contact.full_name,
        stage_id: contact.stage_id,
        pipeline_id: contact.pipeline_id,
        email: contact.email,
        phone: contact.phone,
        whatsapp: contact.whatsapp,
        cro: contact.cro,
        cpf_cnpj: contact.cpf_cnpj,
        specialty: contact.specialty,
        client_type: contact.client_type,
        clinic_name: contact.clinic_name,
        address: contact.address,
        city: contact.city,
        state: contact.state,
        observations: contact.observations,
        next_steps: contact.next_steps,
        responsible_id: contact.responsible_id,
        next_interaction_date: contact.next_interaction_date,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
        last_interaction: contact.last_interaction,
        stage: contact.stage
      }));

      setContacts(mappedContacts);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      toast.error("Falha ao carregar contatos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md border">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Nenhum contato encontrado neste pipeline
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Estágio</TableHead>
              <TableHead>Última interação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.full_name}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    {contact.email && (
                      <div className="flex items-center text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        {contact.email}
                      </div>
                    )}
                    {contact.whatsapp && (
                      <div className="flex items-center text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        {contact.whatsapp}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {contact.stage && (
                    <div className="flex items-center">
                      <span 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: contact.stage.color }}
                      ></span>
                      <span>{contact.stage.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {contact.last_interaction && format(
                    new Date(contact.last_interaction),
                    "dd/MM/yyyy",
                    { locale: ptBR }
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onContactClick(contact)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
