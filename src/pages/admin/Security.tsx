
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Security = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Segurança</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gerencie configurações de segurança e permissões do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
