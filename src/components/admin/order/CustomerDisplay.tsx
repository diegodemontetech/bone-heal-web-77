
import { User } from "lucide-react";

interface CustomerDisplayProps {
  customer: {
    full_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    email?: string;
    omie_code?: string;
  };
}

export const CustomerDisplay = ({ customer }: CustomerDisplayProps) => {
  if (!customer) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Cliente</label>
      <div className="p-3 border rounded bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{customer.full_name || "Nome não informado"}</p>
            {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
            <p className="text-sm text-gray-600">{customer.phone || "Telefone não informado"}</p>
            <p className="text-sm text-gray-600">{customer.address || "Endereço não informado"}</p>
            <p className="text-sm text-gray-600">
              {customer.city && customer.state 
                ? `${customer.city} - ${customer.state}` 
                : "Cidade/Estado não informados"}
              {customer.zip_code && ` (CEP: ${customer.zip_code})`}
            </p>
            {customer.omie_code && (
              <p className="text-sm font-medium text-green-600">Código Omie: {customer.omie_code}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
