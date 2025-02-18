
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, Truck, Package, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const statusIcons: Record<string, any> = {
  novo: Package,
  aguardando_pagamento: CreditCard,
  pago: CheckCircle2,
  faturando: Package,
  faturado: Package,
  separacao: Package,
  aguardando_envio: Package,
  enviado: Truck,
  entregue: CheckCircle2,
  cancelado: AlertCircle,
};

const statusLabels: Record<string, string> = {
  novo: "Pedido Recebido",
  aguardando_pagamento: "Aguardando Pagamento",
  pago: "Pagamento Confirmado",
  faturando: "Preparando Pedido",
  faturado: "Pedido Faturado",
  separacao: "Em Separação",
  aguardando_envio: "Pronto para Envio",
  enviado: "Em Transporte",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const Orders = () => {
  const session = useSession();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, payments(*)")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

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
          <div className="grid gap-6">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.omie_status || "novo"] || Package;
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Pedido realizado em {format(new Date(order.created_at), "dd/MM/yyyy")}
                        </p>
                        <CardTitle className="text-lg mt-1">
                          Pedido #{order.id.slice(0, 8)}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Total do pedido:</p>
                        <p className="text-lg font-bold text-primary">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <StatusIcon className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">
                          {statusLabels[order.omie_status || "novo"]}
                        </p>
                        {order.omie_status === "enviado" && (
                          <p className="text-sm text-gray-500 mt-1">
                            Previsão de entrega em até 5 dias úteis
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Produtos do pedido */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">Produtos</h3>
                        <div className="space-y-3">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{item.quantity}x {item.name || "Produto"}</p>
                              </div>
                              <p className="text-gray-600">
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Informações de entrega */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">Entrega</h3>
                        <p className="text-gray-600">
                          CEP: {order.shipping_address?.zip_code}
                        </p>
                        <p className="text-gray-600 mt-2">
                          Frete: {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(order.shipping_fee)}
                        </p>
                      </div>

                      {/* Status do pagamento */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">Pagamento</h3>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <p className="text-gray-600">
                            {order.payment_method === "credit" ? "Cartão de Crédito" : "PIX"}
                          </p>
                        </div>
                        <p className="text-gray-600 mt-2">
                          Status: {order.payments?.[0]?.status === "paid" ? "Pago" : "Pendente"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Você ainda não tem pedidos.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;
