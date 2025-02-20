
import { Card, CardContent } from "@/components/ui/card";

interface CustomerDisplayProps {
  customer: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
}

export const CustomerDisplay = ({ customer }: CustomerDisplayProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Cliente</label>
      <div className="p-3 border rounded bg-gray-50">
        <p className="font-medium">{customer.full_name}</p>
        <p className="text-sm text-gray-600">{customer.phone}</p>
        <p className="text-sm text-gray-600">{customer.address}</p>
        <p className="text-sm text-gray-600">
          {customer.city} - {customer.state}
        </p>
      </div>
    </div>
  );
};
