
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Tag } from "lucide-react";
import CommercialConditionDialog from "@/components/admin/commercial-conditions/CommercialConditionDialog";
import CommercialConditionsList from "@/components/admin/commercial-conditions/CommercialConditionsList";

const AdminCommercialConditions = () => {
  const { data: conditions, isLoading, error, refetch } = useQuery({
    queryKey: ["commercial-conditions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commercial_conditions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erro ao carregar condições comerciais:", error);
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Tag className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Condições Comerciais</h1>
        </div>
        <CommercialConditionDialog onSuccess={refetch} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar condições comerciais: {(error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            Lista de Condições Comerciais
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              {conditions?.length || 0} {conditions?.length === 1 ? 'condição' : 'condições'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CommercialConditionsList 
            conditions={conditions} 
            isLoading={isLoading} 
            onDelete={refetch}
            onToggle={refetch} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCommercialConditions;
