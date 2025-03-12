
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">Chamado não encontrado</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate("/support/tickets")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para meus chamados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundState;
