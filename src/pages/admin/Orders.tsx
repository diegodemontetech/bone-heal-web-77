
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import PriceCalculator from "@/components/admin/PriceCalculator";

const Orders = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Pedidos</h1>
            <PriceCalculator />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Orders;
