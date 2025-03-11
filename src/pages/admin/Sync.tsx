
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

const Sync = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Sincronização</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sincronização com Sistemas Externos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure a sincronização de dados com sistemas externos como Omie.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sync;
