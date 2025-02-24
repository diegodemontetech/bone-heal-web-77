
import AdminLayout from "@/components/admin/Layout";
import ShippingRatesTable from "@/components/admin/ShippingRatesTable";

const AdminShippingRates = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Fretes</h1>
        <div className="mb-4 text-sm text-muted-foreground">
          Configure as taxas de frete por estado e tipo de serviço. Os valores serão utilizados para cálculo automático no checkout.
        </div>
        <ShippingRatesTable />
      </div>
    </AdminLayout>
  );
};

export default AdminShippingRates;
