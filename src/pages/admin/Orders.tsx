
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Package, Truck, CheckCircle2, AlertCircle, DollarSign } from "lucide-react";
import { format, addDays, isAfter } from "date-fns";
import { toast } from "sonner";
import CreateOrder from "@/components/admin/CreateOrder";

const COLUMNS = [
  { id: 'pending', title: 'Pendente', icon: Calendar },
  { id: 'paid', title: 'Pago', icon: DollarSign },
  { id: 'invoiced', title: 'Faturado', icon: Package },
  { id: 'shipped', title: 'Enviado', icon: Truck },
  { id: 'delivered', title: 'Entregue', icon: CheckCircle2 },
  { id: 'canceled', title: 'Cancelado', icon: AlertCircle }
];

const Orders = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  // Verificar se o usuário é admin
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Buscar pedidos
  const { data: orders, isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone,
            zip_code
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.is_admin,
  });

  // Verificar pedidos pendentes antigos
  useEffect(() => {
    const checkPendingOrders = async () => {
      if (!orders) return;

      const fiveDaysAgo = addDays(new Date(), -5);
      
      orders.forEach(async (order) => {
        if (
          order.status === 'pending' && 
          isAfter(new Date(), addDays(new Date(order.created_at), 5))
        ) {
          await handleUpdateOrderStatus(order.id, 'canceled');
          toast.info(`Pedido ${order.id.slice(0,8)} cancelado por falta de pagamento`);
        }
      });
    };

    checkPendingOrders();
    const interval = setInterval(checkPendingOrders, 1000 * 60 * 60); // Checar a cada hora
    
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    if (!profileLoading && !profile?.is_admin) {
      navigate("/orders");
    }
  }, [profileLoading, profile, navigate]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      refetch();
      toast.success('Status atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const syncOrderWithOmie = async (orderId: string) => {
    try {
      toast.loading('Sincronizando pedido com Omie...');
      
      // Primeiro, verifica se o pedido existe e tem todos os dados necessários
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone,
            zip_code,
            cpf,
            cnpj,
            address,
            city,
            state,
            neighborhood
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      
      if (!order.profiles) {
        throw new Error('Dados do cliente incompletos');
      }

      // Chama a função de integração
      const { error } = await supabase.functions.invoke('omie-integration', {
        body: { 
          action: 'sync_order',
          order_id: orderId,
          order_data: order
        }
      });

      if (error) throw error;

      toast.dismiss();
      toast.success('Pedido sincronizado com sucesso');
      refetch();
    } catch (error: any) {
      console.error('Erro ao sincronizar pedido:', error);
      toast.dismiss();
      toast.error(`Erro ao sincronizar pedido: ${error.message}`);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    if (newStatus === 'invoiced') {
      await syncOrderWithOmie(draggableId);
    }

    await handleUpdateOrderStatus(draggableId, newStatus);
  };

  const getOrdersByStatus = (status: string) => {
    return orders?.filter(order => 
      status === 'pending' ? ['pending', 'awaiting_payment'].includes(order.status)
      : order.status === status
    ) || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 border-yellow-200';
      case 'paid': return 'bg-green-100 border-green-200';
      case 'invoiced': return 'bg-blue-100 border-blue-200';
      case 'shipped': return 'bg-purple-100 border-purple-200';
      case 'delivered': return 'bg-emerald-100 border-emerald-200';
      case 'canceled': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  if (profileLoading || ordersLoading) {
    return null;
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Gerenciamento de Pedidos</h1>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido
              </Button>
            </div>

            <Tabs defaultValue="kanban" className="space-y-4">
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="create" disabled={!isCreating}>
                  Criar Pedido
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kanban">
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {COLUMNS.map(column => (
                      <div key={column.id} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-100 rounded">
                          <column.icon className="w-4 h-4" />
                          <h3 className="font-semibold">{column.title}</h3>
                          <span className="ml-auto bg-gray-200 px-2 py-0.5 rounded text-sm">
                            {getOrdersByStatus(column.id).length}
                          </span>
                        </div>
                        
                        <Droppable droppableId={column.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="flex-1 min-h-[500px]"
                            >
                              {getOrdersByStatus(column.id).map((order, index) => (
                                <Draggable
                                  key={order.id}
                                  draggableId={order.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-3 mb-2 rounded border ${getStatusColor(order.status)} hover:shadow-md transition-shadow`}
                                    >
                                      <p className="font-medium">
                                        Pedido #{order.id.slice(0, 8)}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {order.profiles?.full_name}
                                      </p>
                                      <p className="text-sm">
                                        {format(new Date(order.created_at), "dd/MM/yyyy")}
                                      </p>
                                      <p className="font-medium text-primary">
                                        {new Intl.NumberFormat('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL'
                                        }).format(order.total_amount)}
                                      </p>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              </TabsContent>

              <TabsContent value="create">
                {isCreating && (
                  <CreateOrder onCancel={() => setIsCreating(false)} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Orders;
