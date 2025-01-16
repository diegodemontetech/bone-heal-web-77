import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-800",
  aguardando_pagamento: "bg-yellow-100 text-yellow-800",
  pago: "bg-green-100 text-green-800",
  faturando: "bg-purple-100 text-purple-800",
  faturado: "bg-indigo-100 text-indigo-800",
  separacao: "bg-orange-100 text-orange-800",
  aguardando_envio: "bg-cyan-100 text-cyan-800",
  enviado: "bg-teal-100 text-teal-800",
  entregue: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  novo: "Novo",
  aguardando_pagamento: "Aguardando Pagamento",
  pago: "Pago",
  faturando: "Faturando",
  faturado: "Faturado",
  separacao: "Em Separação",
  aguardando_envio: "Aguardando Envio",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const Orders = () => {
  const session = useSession();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["orders", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, payments(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const checkOrderStatus = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("omie-integration", {
        body: { action: "check_status", order_id: orderId },
      });

      if (error) throw error;
      
      await refetch();
      toast.success("Status do pedido atualizado com sucesso!");
    } catch (error) {
      console.error("Error checking order status:", error);
      toast.error("Erro ao verificar status do pedido");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Meus Pedidos</h1>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Meus Pedidos</h1>
        {orders && orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número do Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Status OMIE</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status do Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.omie_status || "novo"]}>
                      {statusLabels[order.omie_status || "novo"]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {order.payments?.[0]?.status || "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => checkOrderStatus(order.id)}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      Atualizar Status
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Você ainda não tem pedidos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;