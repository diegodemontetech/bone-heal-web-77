
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

const ShippingRates = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Taxas de Envio</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Taxas de Envio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure e ajuste as taxas de frete para diferentes regiões.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingRates;
