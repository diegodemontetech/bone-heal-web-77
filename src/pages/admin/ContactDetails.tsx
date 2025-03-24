
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ContactDetails from "@/components/admin/contact/ContactDetails";

const AdminContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchContactDetails();
    }
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setContact(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do contato:", error);
      toast("Erro ao carregar contato", {
        description: "Ocorreu um erro ao buscar os detalhes do contato",
        icon: "❌"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (replyMessage: string) => {
    try {
      if (!profile?.id) {
        toast("Erro de autenticação", {
          description: "Você precisa estar logado para enviar respostas",
          icon: "❌"
        });
        return;
      }

      // Atualizar o contato com a resposta
      const { error } = await supabase
        .from("contact_messages")
        .update({ 
          reply: replyMessage,
          replied: true,
          replied_at: new Date().toISOString(),
          replied_by: profile.id
        })
        .eq("id", id);

      if (error) throw error;

      // Aqui você pode adicionar uma lógica para enviar um email de resposta
      // usando alguma função do Supabase Edge Functions ou outro serviço

      toast("Resposta enviada", {
        description: "A resposta foi enviada com sucesso",
      });
      
      // Atualizar o objeto de contato localmente
      setContact({
        ...contact,
        reply: replyMessage,
        replied: true,
        replied_at: new Date().toISOString(),
        replied_by: profile.id
      });
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast("Erro ao enviar resposta", {
        description: "Ocorreu um erro ao enviar a resposta",
        icon: "❌"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/contacts")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Contatos
          </Button>
          <Skeleton className="h-8 w-48 ml-4" />
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/contacts")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Contatos
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <p className="text-muted-foreground">Contato não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => navigate("/admin/contacts")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Contatos
          </Button>
          <h1 className="text-2xl font-bold ml-4">
            Contato de {contact.name}
          </h1>
        </div>
      </div>

      <ContactDetails 
        contact={contact} 
        onSendReply={sendReply}
      />
    </div>
  );
};

export default AdminContactDetails;
