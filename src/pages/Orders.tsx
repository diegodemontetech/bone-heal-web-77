import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Button } from "@/components/ui/button";
import { parseJsonArray, parseJsonObject } from "@/utils/supabaseJsonUtils";

const statusColors: { [key: string]: string } = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function Orders() {
  const { session, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session || !profile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar pedidos:", error);
          setError("Erro ao buscar pedidos. Por favor, tente novamente.");
          return;
        }

        if (data) {
          setOrders(data as Order[]);
        }
      } catch (err: any) {
        console.error("Erro inesperado ao buscar pedidos:", err);
        setError("Erro inesperado ao buscar pedidos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, profile]);

  if (loading) {
    return <div className="text-center">Carregando seus pedidos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!orders.length) {
    return <div className="text-center">Nenhum pedido encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Seus Pedidos</h1>

      <Table>
        <TableCaption>Uma lista de seus pedidos recentes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Pedido #</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Endereço de Entrega</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const itemsArray = parseJsonArray(order.items, []);
            const displayItems = itemsArray.map(item => {
              return `${item.quantity}x ${item.name}`;
            }).join(', ');

            const shippingInfo = parseJsonObject(order.shipping_address, {});
            const zipCode = shippingInfo.zip_code || '';
            const city = shippingInfo.city || '';
            const state = shippingInfo.state || '';
            const address = shippingInfo.address || '';

            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{displayItems}</TableCell>
                <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {address}, {city} - {state}, {zipCode}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
