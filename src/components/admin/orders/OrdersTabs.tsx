
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersKanban from "./OrdersKanban";
import { OrdersList } from "./OrdersList";
import EmptyOrdersMessage from "./EmptyOrdersMessage";
import OrdersErrorMessage from "./OrdersErrorMessage";
import CreateOrder from "@/components/admin/CreateOrder";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

interface OrdersTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  orders: any[] | null;
  error: any;
  refetch: () => void;
  onViewOrder: (order: any) => void;
}

const OrdersTabs = ({
  activeTab,
  setActiveTab,
  isCreating,
  setIsCreating,
  orders,
  error,
  refetch,
  onViewOrder
}: OrdersTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
        <TabsTrigger value="list">Lista</TabsTrigger>
        <TabsTrigger value="create" disabled={!isCreating}>
          Criar Pedido
        </TabsTrigger>
      </TabsList>

      <TabsContent value="kanban">
        {error ? (
          <OrdersErrorMessage refetch={refetch} />
        ) : orders && orders.length > 0 ? (
          <OrdersKanban 
            orders={orders} 
            refetchOrders={refetch} 
            onViewOrder={onViewOrder}
          />
        ) : (
          <EmptyOrdersMessage setIsCreating={setIsCreating} />
        )}
      </TabsContent>

      <TabsContent value="list">
        {error ? (
          <OrdersErrorMessage refetch={refetch} />
        ) : orders && orders.length > 0 ? (
          <OrdersList 
            orders={orders} 
            onViewOrder={onViewOrder}
            refetchOrders={refetch}
          />
        ) : (
          <EmptyOrdersMessage setIsCreating={setIsCreating} />
        )}
      </TabsContent>

      <TabsContent value="create">
        {isCreating && (
          <CreateOrder 
            onCancel={() => {
              setIsCreating(false);
              setActiveTab("kanban");
            }} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default OrdersTabs;
