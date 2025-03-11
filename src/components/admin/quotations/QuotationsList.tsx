
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuotationsQuery } from "./hooks/useQuotationsQuery";
import { useEmailSender } from "./hooks/useEmailSender";
import { useQuotationActions } from "./hooks/useQuotationActions";
import SearchBar from "./components/SearchBar";
import QuotationsTable from "./components/QuotationsTable";

const QuotationsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: quotations, isLoading } = useQuotationsQuery();
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
