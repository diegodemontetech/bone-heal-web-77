
import { format, addBusinessDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeliveryInfoProps {
  deliveryDate: Date | null;
  deliveryDays?: number | null;
}

const DeliveryInfo = ({ deliveryDate, deliveryDays }: DeliveryInfoProps) => {
  // Se não temos uma data de entrega mas temos o número de dias,
  // calcular a data de entrega a partir de hoje
  const actualDeliveryDate = deliveryDate || 
    (deliveryDays ? addBusinessDays(new Date(), deliveryDays) : null);
  
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
