
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

const Vouchers = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Ticket className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Cupons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Crie e gerencie cupons de desconto para seus clientes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vouchers;
