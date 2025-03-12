
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface OrderSummaryProps {
  subtotal?: number;
  shipping_fee?: number;
  discount?: number;
  total_amount?: number;
  status?: string;
}

const OrderSummaryCard = ({ 
  subtotal, 
  shipping_fee, 
  discount, 
  total_amount, 
  status 
}: OrderSummaryProps) => {
  const navigate = useNavigate();

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {subtotal?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span>R$ {shipping_fee?.toFixed(2) || "0.00"}</span>
          </div>
          {(discount && discount > 0) && (
            <div className="flex justify-between text-green-600">
              <span>Desconto</span>
              <span>- R$ {discount?.toFixed(2) || "0.00"}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>R$ {total_amount?.toFixed(2) || "0.00"}</span>
          </div>
        </div>
        
        {status === 'pending' && (
          <Button className="w-full mt-6 bg-primary">
            Finalizar Pagamento
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-3"
          onClick={() => navigate('/products')}
        >
          Continuar Comprando
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
