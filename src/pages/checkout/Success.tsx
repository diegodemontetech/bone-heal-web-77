
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (!paymentId) {
      navigate("/");
    }
  }, [paymentId, navigate]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h1>
          <p className="text-gray-600 mb-6">
            Seu pedido foi processado com sucesso.
            <br />
            Você receberá um e-mail com os detalhes do pedido.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate("/products")}>
              Continuar Comprando
            </Button>
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Ver Meus Pedidos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
