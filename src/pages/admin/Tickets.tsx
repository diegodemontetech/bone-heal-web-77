
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TicketsList from "@/components/admin/tickets/TicketsList";
import TicketFilters from "@/components/admin/tickets/TicketFilters";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const statusOptions = {
  open: "Aberto",
  in_progress: "Em Andamento",
  resolved: "Resolvido",
  closed: "Fechado"
};

const priorityOptions = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
  urgent: "Urgente"
};

interface TicketFormData {
  title: string;
  description: string;
  priority: string;
  customer_id: string | null;
}

const TicketForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    description: "",
    priority: "normal",
    customer_id: null
  });

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("is_admin", false)
        .order("full_name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("support_tickets")
        .insert([{
          title: formData.title,
          description: formData.description,
          status: "open",
          priority: formData.priority,
          customer_id: formData.customer_id,
          created_by: profile?.id,
          assigned_to: profile?.id
        }]);

      if (error) throw error;

      toast.success("Ticket criado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast.error("Erro ao criar ticket. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer_id">Cliente</Label>
        <Select
          value={formData.customer_id || ""}
          onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value || null }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers?.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.full_name || customer.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Prioridade</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          required
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Ticket"}
      </Button>
    </form>
  );
};

const AdminTickets = () => {
  const { profile, isAdminMaster, hasPermission } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  console.log("Auth no Tickets:", { profile, isAdminMaster, hasPermission });

  // Buscar tickets com filtros
  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["tickets", status, priority, assignedTo],
    queryFn: async () => {
      let query = supabase
        .from("support_tickets")
        .select(`
          *,
          customer:customer_id(full_name, email),
          assigned:assigned_to(full_name)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      if (priority) {
        query = query.eq("priority", priority);
      }

      if (assignedTo) {
        if (assignedTo === "unassigned") {
          query = query.is("assigned_to", null);
        } else {
          query = query.eq("assigned_to", assignedTo);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("is_admin", true);

      if (error) throw error;
      return data;
    },
  });

  const handleResetFilters = () => {
    setStatus(null);
    setPriority(null);
    setAssignedTo(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Ticket</DialogTitle>
            </DialogHeader>
            <TicketForm onSuccess={() => {
              setIsFormOpen(false);
              refetch();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciamento de Tickets</CardTitle>
          <CardDescription>
            Gerencie e acompanhe os chamados de suporte dos clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="open">Abertos</TabsTrigger>
                <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
                <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
              </TabsList>
            </div>

            <TicketFilters
              statusOptions={statusOptions}
              priorityOptions={priorityOptions}
              agents={agents || []}
              selectedStatus={status}
              selectedPriority={priority}
              selectedAgent={assignedTo}
              onStatusChange={setStatus}
              onPriorityChange={setPriority}
              onAgentChange={setAssignedTo}
              onReset={handleResetFilters}
            />

            <TabsContent value="all">
              <TicketsList 
                tickets={tickets} 
                isLoading={isLoading} 
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
            
            <TabsContent value="open">
              <TicketsList 
                tickets={tickets?.filter(t => t.status === 'open')} 
                isLoading={isLoading}
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
            
            <TabsContent value="in_progress">
              <TicketsList 
                tickets={tickets?.filter(t => t.status === 'in_progress')} 
                isLoading={isLoading}
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
            
            <TabsContent value="resolved">
              <TicketsList 
                tickets={tickets?.filter(t => t.status === 'resolved' || t.status === 'closed')} 
                isLoading={isLoading}
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTickets;
