
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuotationsQuery } from "./hooks/useQuotationsQuery";
import { useEmailSender } from "./hooks/useEmailSender";
import { useQuotationActions } from "./hooks/useQuotationActions";
import SearchBar from "./components/SearchBar";
import QuotationsTable from "./components/QuotationsTable";
import { toast } from "sonner";

const QuotationsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: quotations, isLoading, error } = useQuotationsQuery();
  const { handleSendEmail } = useEmailSender();
  const { 
    handleDownloadPdf, 
    handleConvertToOrder, 
    handleShareWhatsApp 
  } = useQuotationActions();

  // Filtrar orçamentos com base no termo de busca
  const filteredQuotations = quotations?.filter(quotation => {
    const customerName = quotation.customer?.full_name?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      customerName.includes(searchTermLower) ||
      quotation.id.toLowerCase().includes(searchTermLower)
    );
  });

  if (error) {
    console.error("Erro ao carregar orçamentos:", error);
    return (
      <div className="flex justify-center py-10">
        <div className="text-center space-y-4">
          <p className="text-red-500">Erro ao carregar orçamentos</p>
          <button 
            className="text-blue-500 underline" 
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="rounded-md border">
        <QuotationsTable 
          quotations={filteredQuotations || []} 
          onSendEmail={handleSendEmail}
          onDownloadPdf={handleDownloadPdf}
          onConvertToOrder={handleConvertToOrder}
          onShareWhatsApp={handleShareWhatsApp}
        />
      </div>
    </div>
  );
};

export default QuotationsList;
