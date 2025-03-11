
import { Card } from "@/components/ui/card";

interface CustomerSectionProps {
  customerInfo: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  } | null | undefined;
}

export const CustomerSection = ({ customerInfo }: CustomerSectionProps) => {
  if (!customerInfo) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Cliente</h3>
      <div className="p-3 border rounded bg-gray-50">
        <p className="font-medium">{customerInfo.name}</p>
        {customerInfo.email && <p className="text-sm text-gray-600">{customerInfo.email}</p>}
        {customerInfo.phone && <p className="text-sm text-gray-600">{customerInfo.phone}</p>}
        {customerInfo.address && (
          <>
            <p className="text-sm text-gray-600">{customerInfo.address}</p>
            <p className="text-sm text-gray-600">
              {customerInfo.city} - {customerInfo.state}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
