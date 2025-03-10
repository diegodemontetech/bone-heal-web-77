
import { CustomerProfile } from "../hooks/useQuotationsQuery";

interface CustomerInfoProps {
  customer: CustomerProfile | null;
}

const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  return (
    <div>
      <p className="font-medium">
        {customer?.full_name || "Cliente não identificado"}
      </p>
      <p className="text-sm text-muted-foreground">
        {customer?.email || "Email não informado"}
      </p>
    </div>
  );
};

export default CustomerInfo;
