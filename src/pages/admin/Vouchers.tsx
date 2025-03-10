
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import VoucherDialog from "@/components/admin/vouchers/VoucherDialog";
import VouchersList from "@/components/admin/vouchers/VouchersList";

const AdminVouchers = () => {
  const { data: vouchers, isLoading, refetch } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
          <VoucherDialog onSuccess={refetch} />
        </div>

        <Card>
          <CardContent className="p-0">
            <VouchersList 
              vouchers={vouchers} 
              isLoading={isLoading} 
              onDelete={refetch} 
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVouchers;
