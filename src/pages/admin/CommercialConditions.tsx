
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent } from "lucide-react";

const CommercialConditions = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Percent className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Condições Comerciais</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Políticas Comerciais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure regras de desconto e condições especiais para diferentes grupos de clientes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommercialConditions;
