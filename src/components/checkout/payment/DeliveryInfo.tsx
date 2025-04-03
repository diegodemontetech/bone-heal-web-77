
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeliveryInfoProps {
  deliveryDate: Date | null;
}

const DeliveryInfo = ({ deliveryDate }: DeliveryInfoProps) => {
  if (!deliveryDate) return null;
  
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
      <p className="text-sm text-blue-700 font-medium">
        Receba até {format(deliveryDate, "dd 'de' MMMM", { locale: ptBR })}
      </p>
    </div>
  );
};

export default DeliveryInfo;
