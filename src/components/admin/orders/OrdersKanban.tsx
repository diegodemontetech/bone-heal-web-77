import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const COLUMNS = [
  { id: 'novo', title: 'Novo', icon: Calendar },
  { id: 'sincronizando', title: 'Sincronizando', icon: Package },
  { id: 'sincronizado', title: 'Sincronizado', icon: CheckCircle2 },
  { id: 'cancelado', title: 'Cancelado', icon: AlertCircle }
];

interface OrdersKanbanProps {
  orders: any[] | null;
  refetchOrders: () => void;
  onViewOrder: (order: any) => void;
}

const OrdersKanban = ({ orders, refetchOrders, onViewOrder }: OrdersKanbanProps) => {
  const getOrdersByStatus = (status: string) => {
    return orders?.filter(order => order.omie_status === status) || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-yellow-100 border-yellow-200';
      case 'sincronizando': return 'bg-blue-100 border-blue-200';
      case 'sincronizado': return 'bg-green-100 border-green-200';
      case 'cancelado': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ omie_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      refetchOrders();
      toast.success('Status atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const syncOrderWithOmie = async (orderId: string) => {
    try {
      toast.loading('Sincronizando pedido com Omie...');
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        throw new Error(`Erro ao buscar pedido: ${orderError?.message || 'Pedido não encontrado'}`);
      }

      console.log('Dados do pedido encontrados:', order);

      if (!order.profiles) {
        throw new Error('Perfil do cliente não encontrado para o pedido');
      }

      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        throw new Error('Pedido não possui itens');
      }

      // Buscar dados completos dos produtos
      const items = await Promise.all(
        order.items.map(async (item: any) => {
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', item.product_id)
            .single();
          
          if (productError || !product) {
            throw new Error(`Produto não encontrado: ${item.product_id}`);
          }
          
          if (!product.omie_code) {
            throw new Error(`Produto ${product.name} não possui código Omie`);
          }
          
          return {
            ...item,
            omie_code: product.omie_code,
            name: product.name,
            price: product.price
          };
        })
      );

      // Preparar payload para a edge function
      const payload = {
        action: 'sync_order',
        order_id: orderId,
        order_data: {
          id: order.id,
          items: items,
          total_amount: order.total_amount,
          profiles: order.profiles
        }
      };

      console.log('Payload para sincronização:', payload);

      const { data: responseData, error: integrationError } = await supabase.functions.invoke(
        'omie-integration',
        {
          body: payload
        }
      );

      if (integrationError) {
        throw new Error(`Erro na integração: ${integrationError.message}`);
      }

      if (!responseData?.success) {
        throw new Error(responseData?.error || 'Erro desconhecido na sincronização');
      }

      // Atualizar status do pedido
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          omie_status: 'sincronizado',
          omie_order_id: responseData.omie_order_id,
          omie_last_update: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error(`Erro ao atualizar status do pedido: ${updateError.message}`);
      }

      toast.dismiss();
      toast.success('Pedido sincronizado com sucesso');
      refetchOrders();
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

    if (newStatus === 'sincronizando') {
      await syncOrderWithOmie(draggableId);
    } else {
      await handleUpdateOrderStatus(draggableId, newStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          className={`p-3 mb-2 rounded border ${getStatusColor(order.omie_status)} hover:shadow-md transition-shadow cursor-pointer`}
                          onClick={() => onViewOrder(order)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                Pedido #{order.id.slice(0, 8)}
                              </p>
                              {order.profiles && (
                                <div className="mt-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    {order.profiles.full_name}
                                  </p>
                                  {order.profiles.phone && (
                                    <p className="text-xs text-gray-600">
                                      {order.profiles.phone}
                                    </p>
                                  )}
                                  {order.profiles.email && (
                                    <p className="text-xs text-gray-600 truncate max-w-[200px]">
                                      {order.profiles.email}
                                    </p>
                                  )}
                                </div>
                              )}
                              <p className="text-sm mt-2">
                                {format(new Date(order.created_at), "dd/MM/yyyy")}
                              </p>
                            </div>
                            <p className="font-medium text-primary">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(order.total_amount)}
                            </p>
                          </div>
                          
                          {order.items && order.items.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                              </p>
                            </div>
                          )}
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
  );
};

export default OrdersKanban;
