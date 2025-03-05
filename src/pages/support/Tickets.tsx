
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";
import { TicketList } from "@/components/support/TicketList";
import { TicketForm } from "@/components/support/TicketForm";

const Tickets = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["support-tickets", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*, ticket_messages(id)')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const handleTicketCreated = () => {
    setIsFormOpen(false);
    refetch();
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Faça login para acessar seus tickets de suporte.</p>
          <Button onClick={() => navigate("/login")}>Fazer Login</Button>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Meus Tickets de Suporte</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Ticket
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <TicketList tickets={tickets || []} />
        )}
        
        {isFormOpen && (
          <TicketForm 
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleTicketCreated}
          />
        )}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Tickets;
