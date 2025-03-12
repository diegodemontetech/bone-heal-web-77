
interface CustomerDisplayProps {
  customer: {
    full_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
}

export const CustomerDisplay = ({ customer }: CustomerDisplayProps) => {
  console.log("Exibindo detalhes do cliente:", customer);
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Cliente</label>
      <div className="p-3 border rounded bg-gray-50">
        <p className="font-medium">{customer.full_name || "Nome não informado"}</p>
        <p className="text-sm text-gray-600">{customer.phone || "Telefone não informado"}</p>
        <p className="text-sm text-gray-600">{customer.address || "Endereço não informado"}</p>
        <p className="text-sm text-gray-600">
          {customer.city && customer.state 
            ? `${customer.city} - ${customer.state}` 
            : "Cidade/Estado não informados"}
          {customer.zip_code && ` (CEP: ${customer.zip_code})`}
        </p>
      </div>
    </div>
  );
};
