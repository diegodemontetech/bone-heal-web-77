
import { Button } from "@/components/ui/button";
import { Eye, Mail } from "lucide-react";

interface QuotationActionsProps {
  quotationId: string;
  customerEmail: string;
  sentByEmail: boolean;
  onSendEmail: (quotationId: string, customerEmail: string) => void;
}

const QuotationActions = ({ 
  quotationId, 
  customerEmail, 
  sentByEmail,
  onSendEmail 
}: QuotationActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="icon"
        title="Ver detalhes"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        title="Enviar por e-mail"
        disabled={sentByEmail}
        onClick={() => onSendEmail(quotationId, customerEmail)}
      >
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuotationActions;
