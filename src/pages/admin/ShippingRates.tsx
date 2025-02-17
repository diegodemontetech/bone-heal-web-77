
import AdminLayout from "@/components/admin/Layout";
import ShippingRatesTable from "@/components/admin/ShippingRatesTable";

const AdminShippingRates = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Fretes</h1>
        <ShippingRatesTable />
      </div>
    </AdminLayout>
  );
};

export default AdminShippingRates;
