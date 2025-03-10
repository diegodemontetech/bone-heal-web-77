
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Sync = () => {
  const [loading, setLoading] = useState(false);

  const handleSyncCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-omie-customers');
      
      if (error) throw error;
      
      console.log('Resultado da sincronização:', data);
      toast.success(data.message);
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkOrderStatus = async () => {
    setLoading(true);
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .is('omie_order_id', null);

      if (orders && orders.length > 0) {
        for (const order of orders) {
          const { error } = await supabase.functions.invoke('omie-integration', {
            body: { action: 'sync_order', order_id: order.id }
          });
          
          if (error) {
            console.error(`Erro ao sincronizar pedido ${order.id}:`, error);
            toast.error(`Erro ao sincronizar pedido ${order.id}`);
          }
        }
        toast.success('Sincronização de pedidos concluída');
      } else {
        toast.info('Não há pedidos pendentes para sincronizar');
      }
    } catch (error) {
      console.error('Erro ao sincronizar pedidos:', error);
      toast.error('Erro ao sincronizar pedidos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Sincronização com Omie</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sincronização de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Sincronize os clientes do Omie com o sistema.
            </p>
            <Button 
              onClick={handleSyncCustomers} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                'Sincronizar Clientes'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sincronização de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Sincronize os pedidos pendentes com o Omie.
            </p>
            <Button 
              onClick={checkOrderStatus} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                'Sincronizar Pedidos'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sync;
