
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Truck } from "lucide-react";
import ShippingRatesTable from "@/components/admin/shipping/ShippingRatesTable";

const AdminShippingRates = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Verifica se usuário tem permissão admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (profile && profile.is_admin) {
          setIsAdmin(true);
        }
      }
    };
    
    checkAdminStatus();
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso restrito</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Configuração de Taxas de Frete</h1>
        </div>
      </div>

      <ShippingRatesTable />
    </div>
  );
};

export default AdminShippingRates;
