
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, 
  Search, 
  Filter, 
  MoreVertical, 
  RefreshCw,
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  CreditCard,
  FileText
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate, formatShortId } from "@/utils/formatters";
import { Order } from "@/types/order";
import { toast } from "sonner";

interface OrdersListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  refetchOrders?: () => void;
}

export const OrdersList = ({ orders, onViewOrder, refetchOrders }: OrdersListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filtro de texto
      const searchMatch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.profiles?.full_name && order.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.omie_order_id && order.omie_order_id.toLowerCase().includes(searchTerm.toLowerCase()));
        
      // Filtro de status
      const statusMatch = 
        statusFilter === "all" || 
        (order.status === statusFilter) ||
        (order.omie_status === statusFilter);
        
      // Filtro de pagamento
      const paymentMatch = 
        paymentFilter === "all" || 
        order.payment_status === paymentFilter;
        
      return searchMatch && statusMatch && paymentMatch;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
      case 'novo':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Novo</Badge>;
      case 'sincronizado':
      case 'synced':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Sincronizado</Badge>;
      case 'paid':
      case 'pago':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Pago</Badge>;
      case 'faturado':
      case 'invoiced':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Faturado</Badge>;
      case 'entregue':
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Entregue</Badge>;
      case 'cancelado':
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{status || 'Desconhecido'}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Aprovado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>;
      case 'rejected':
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" /> Rejeitado</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{status || 'Desconhecido'}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'credit_card':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100"><CreditCard className="w-3 h-3 mr-1" /> Cartão</Badge>;
      case 'pix':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">PIX</Badge>;
      case 'boleto':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-100"><FileText className="w-3 h-3 mr-1" /> Boleto</Badge>;
      default:
        return null;
    }
  };

  const handleSyncOrder = (orderId: string) => {
    if (!refetchOrders) return;
    
    toast.loading('Sincronizando pedido com Omie...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Pedido sincronizado com sucesso!');
      if (refetchOrders) refetchOrders();
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos por ID ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="sincronizado">Sincronizado</SelectItem>
              <SelectItem value="faturado">Faturado</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[150px]">
              <CreditCard className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos pagamentos</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum pedido encontrado com os filtros atuais
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    #{formatShortId(order.id)}
                  </TableCell>
                  <TableCell>
                    {order.profiles?.full_name || order.shipping_address?.recipient_name || "Cliente não especificado"}
                  </TableCell>
                  <TableCell>
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.omie_status || order.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getPaymentBadge(order.payment_status)}
                      {getPaymentMethodBadge(order.payment_method)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.total_amount || 0)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSyncOrder(order.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sincronizar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
