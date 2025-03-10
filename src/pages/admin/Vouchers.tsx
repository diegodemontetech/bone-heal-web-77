
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VoucherDialog from "@/components/admin/vouchers/VoucherDialog";
import VouchersList from "@/components/admin/vouchers/VouchersList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Ticket } from "lucide-react";

const AdminVouchers = () => {
  const { data: vouchers, isLoading, error, refetch } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erro ao carregar cupons:", error);
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        </div>
        <VoucherDialog onSuccess={refetch} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar cupons: {(error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            Lista de Cupons
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              {vouchers?.length || 0} {vouchers?.length === 1 ? 'cupom' : 'cupons'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <VouchersList 
            vouchers={vouchers} 
            isLoading={isLoading} 
            onDelete={refetch} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVouchers;
