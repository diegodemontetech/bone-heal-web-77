
import { Button } from "@/components/ui/button";
import { Eye, Mail, FileDown, ShoppingCart, Share2 } from "lucide-react";

interface QuotationActionsProps {
  quotationId: string;
  customerEmail: string;
  sentByEmail: boolean;
  onSendEmail: (quotationId: string, customerEmail: string) => void;
  onDownloadPdf: (quotationId: string) => void;
  onConvertToOrder: (quotationId: string) => void;
  onShareWhatsApp: (quotationId: string) => void;
}

const QuotationActions = ({ 
  quotationId, 
  customerEmail, 
  sentByEmail,
  onSendEmail,
  onDownloadPdf,
  onConvertToOrder,
  onShareWhatsApp
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
      <Button 
        variant="outline" 
        size="icon"
        title="Baixar PDF"
        onClick={() => onDownloadPdf(quotationId)}
      >
        <FileDown className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        title="Converter em Pedido"
        onClick={() => onConvertToOrder(quotationId)}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        title="Compartilhar via WhatsApp"
        onClick={() => onShareWhatsApp(quotationId)}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuotationActions;
