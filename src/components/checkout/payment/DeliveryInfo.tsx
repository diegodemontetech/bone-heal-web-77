
import { format, addBusinessDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeliveryInfoProps {
  deliveryDate: Date | null;
  deliveryDays?: number | null;
}

const DeliveryInfo = ({ deliveryDate, deliveryDays }: DeliveryInfoProps) => {
  // If we don't have a delivery date but have the number of days,
  // calculate the delivery date from today
  const actualDeliveryDate = deliveryDate || 
    (deliveryDays && !isNaN(deliveryDays) ? addBusinessDays(new Date(), deliveryDays) : null);
  
  if (!actualDeliveryDate) return null;
  
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
      <p className="text-sm text-blue-700 font-medium">
        Receba até {format(actualDeliveryDate, "dd 'de' MMMM", { locale: ptBR })}
      </p>
    </div>
  );
};

export default DeliveryInfo;
