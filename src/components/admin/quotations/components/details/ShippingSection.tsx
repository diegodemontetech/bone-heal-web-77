
interface ShippingInfo {
  service_type?: string;
  name?: string;
  delivery_days?: number;
  cost?: number;
}

interface ShippingSectionProps {
  shippingInfo: ShippingInfo | null | undefined;
}

export const ShippingSection = ({ shippingInfo }: ShippingSectionProps) => {
  if (!shippingInfo) return null;
  
  const hasShippingDetails = shippingInfo.service_type || shippingInfo.name || shippingInfo.delivery_days;
  
  if (!hasShippingDetails) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Informações de Envio</h3>
      <div className="space-y-1">
        {(shippingInfo.service_type || shippingInfo.name) && (
          <p className="text-sm">
            {shippingInfo.service_type}
            {shippingInfo.service_type && shippingInfo.name && ' - '}
            {shippingInfo.name}
          </p>
        )}
        {shippingInfo.delivery_days && (
          <p className="text-sm text-muted-foreground">
            Entrega em até {shippingInfo.delivery_days} dias úteis
          </p>
        )}
      </div>
    </div>
  );
};
