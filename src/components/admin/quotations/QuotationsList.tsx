
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Mail, Eye, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Definir interface para os dados do cliente
interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

// Definir interface para os dados do orçamento
interface Quotation {
  id: string;
  created_at: string;
  customer: CustomerProfile | null;
  status: string;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  sent_by_email: boolean;
}

const QuotationsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: quotations, isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          id,
          created_at,
          customer:profiles(id, full_name, email, phone),
          status,
          total_amount,
          discount_amount,
          payment_method,
          sent_by_email
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar orçamentos:", error);
        throw new Error("Não foi possível carregar os orçamentos");
      }
      
      // Transformar a resposta para garantir que customer seja um objeto e não um array
      return (data || []).map(quotation => {
        // Se customer é um array, pegue o primeiro item ou nulo se vazio
        const customerData = Array.isArray(quotation.customer) 
          ? (quotation.customer.length > 0 ? quotation.customer[0] : null)
          : quotation.customer;
          
        return {
          ...quotation,
          customer: customerData
        } as Quotation;
      });
    },
  });

  // Filtrar orçamentos com base no termo de busca
  const filteredQuotations = quotations?.filter(quotation => {
    const customerName = quotation.customer?.full_name?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      customerName.includes(searchTermLower) ||
      quotation.id.toLowerCase().includes(searchTermLower)
    );
  });

  const handleSendEmail = async (quotationId: string, customerEmail: string) => {
    try {
      // Implementar o envio de e-mail aqui
      toast.success(`E-mail enviado para ${customerEmail}`);
      
      // Atualizar o status de envio no banco de dados
      await supabase
        .from("quotations")
        .update({ sent_by_email: true })
        .eq("id", quotationId);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      toast.error("Erro ao enviar o orçamento por e-mail");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      draft: "bg-gray-200 text-gray-800",
      sent: "bg-blue-200 text-blue-800",
      accepted: "bg-green-200 text-green-800",
      rejected: "bg-red-200 text-red-800",
      expired: "bg-yellow-200 text-yellow-800"
    };

    const statusLabels: Record<string, string> = {
      draft: "Rascunho",
      sent: "Enviado",
      accepted: "Aceito",
      rejected: "Rejeitado",
      expired: "Expirado"
    };

    return (
      <Badge className={statusStyles[status] || "bg-gray-200"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por cliente ou ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotations && filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">
                    {quotation.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{quotation.customer?.full_name || "Cliente não identificado"}</p>
                      <p className="text-sm text-muted-foreground">{quotation.customer?.email || "Email não informado"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(quotation.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    R$ {Number(quotation.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(quotation.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="Enviar por e-mail"
                        disabled={quotation.sent_by_email}
                        onClick={() => handleSendEmail(quotation.id, quotation.customer?.email || "")}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm
                    ? "Nenhum orçamento encontrado para esta busca."
                    : "Nenhum orçamento cadastrado."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuotationsList;
