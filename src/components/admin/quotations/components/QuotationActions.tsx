
import { Button } from "@/components/ui/button";
import { Eye, Mail, FileDown, ShoppingCart, Share2 } from "lucide-react";
import { useState } from "react";
import { QuotationDetails } from "./QuotationDetails";

interface QuotationActionsProps {
  quotationId: string;
  customerEmail: string;
  sentByEmail: boolean;
  status: string;
  quotation: any;
  onSendEmail: (quotationId: string, customerEmail: string) => void;
  onDownloadPdf: (quotationId: string) => void;
  onConvertToOrder: (quotationId: string) => void;
  onShareWhatsApp: (quotationId: string) => void;
}

const QuotationActions = ({ 
  quotationId, 
  customerEmail, 
  sentByEmail,
  status,
  quotation,
  onSendEmail,
  onDownloadPdf,
  onConvertToOrder,
  onShareWhatsApp
}: QuotationActionsProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const isConverted = status === 'converted';

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          title="Ver detalhes"
          onClick={() => setShowDetails(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          title={sentByEmail ? "Email já enviado" : "Enviar por e-mail"}
          disabled={sentByEmail || !customerEmail}
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
          title={isConverted ? "Já convertido em pedido" : "Converter em Pedido"}
          disabled={isConverted}
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

      {quotation && (
        <QuotationDetails 
          quotation={quotation}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default QuotationActions;
