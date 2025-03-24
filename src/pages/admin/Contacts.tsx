
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import ContactList from "@/components/admin/contact/ContactList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";

const AdminContacts = () => {
  const { profile } = useAuth();
  const [contacts, setContacts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      toast("Erro ao carregar contatos", {
        description: "Ocorreu um erro ao buscar os contatos",
        icon: "❌"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchContacts().finally(() => {
      setIsRefreshing(false);
      toast("Contatos atualizados", {
        description: "Lista de contatos atualizada com sucesso"
      });
    });
  };

  // Filtrar contatos com base na aba ativa e no termo de pesquisa
  const filteredContacts = contacts?.filter(contact => {
    // Filtrar por status de resposta
    if (activeTab === "pending" && contact.replied) {
      return false;
    }
    if (activeTab === "replied" && !contact.replied) {
      return false;
    }

    // Filtrar por termo de pesquisa
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.subject?.toLowerCase().includes(searchLower) ||
        contact.message?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Formulários de Contato</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Pesquisar contatos..."
              className="pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Aguardando</TabsTrigger>
            <TabsTrigger value="replied">Respondidos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <ContactList
              contacts={filteredContacts || []}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContacts;
