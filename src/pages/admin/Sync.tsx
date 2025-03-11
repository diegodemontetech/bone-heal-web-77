
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OmieCustomersSync from "@/components/admin/OmieCustomersSync";
import TestOmieSync from "@/components/TestOmieSync";

const Sync = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Sincronização</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OmieCustomersSync />
        
        <Card>
          <CardHeader>
            <CardTitle>Teste de Sincronização</CardTitle>
            <CardDescription>
              Teste a sincronização de um único cliente com o Omie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestOmieSync />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sync;
