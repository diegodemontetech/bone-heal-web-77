
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const ApiEvolution = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">API Evolution (WhatsApp)</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração da API Evolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure as credenciais e opções da API Evolution para integração com WhatsApp.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiEvolution;
