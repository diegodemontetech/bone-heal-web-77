
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import ContactList from "@/components/admin/contact/ContactList";

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchContacts();
  }, [activeTab]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('contact_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (activeTab === 'pending') {
        query = query.eq('status', 'pending');
      } else if (activeTab === 'contacted') {
        query = query.eq('status', 'contacted');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setContacts(data || []);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term) ||
      contact.phone?.toLowerCase().includes(term) ||
      contact.reason?.toLowerCase().includes(term) ||
      contact.message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Formulários de Contato</h1>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contatos..."
            className="w-full md:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Aguardando Resposta</TabsTrigger>
                <TabsTrigger value="contacted">Respondidos</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactList 
            contacts={filteredContacts} 
            isLoading={loading} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
