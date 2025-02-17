
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Falha no Pagamento</h1>
          <p className="text-gray-600 mb-6">
            Houve um problema ao processar seu pagamento.
            <br />
            Por favor, tente novamente ou entre em contato conosco.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate("/checkout")}>
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={() => navigate("/contact")}>
              Falar com Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Failure;
