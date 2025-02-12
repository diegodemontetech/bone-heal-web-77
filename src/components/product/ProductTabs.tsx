
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Play } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const formatDescription = (text: string) => {
    if (!text) return "";
    
    // Dividir o texto em linhas e remover espaços extras
    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

    let output = "";
    let currentSection = "";

    // Processar cada linha
    lines.forEach(line => {
      // Se é um cabeçalho de seção
      if (line.includes("Características:") || 
          line.includes("Contraindicações:") || 
          line.includes("Registro ANVISA:")) {
        // Fechar a seção anterior se existir
        if (currentSection) {
          output += "</div>";
        }
        currentSection = line;
        output += `<h3 class="text-lg font-semibold bg-neutral-100 px-6 py-4">${line}</h3><div class="divide-y divide-neutral-100">`;
      }
      // Se é um item de lista (começa com \n• ou apenas •)
      else if (line.includes("•")) {
        const items = line.split("•").filter(Boolean);
        items.forEach(item => {
          if (item.trim()) {
            output += `
              <div class="flex px-6 py-4 bg-white">
                <span class="text-primary mr-2">•</span>
                <span class="text-neutral-600">${item.trim()}</span>
              </div>`;
          }
        });
      }
      // Se é texto normal
      else {
        output += `<p class="px-6 py-4 bg-white text-neutral-600">${line}</p>`;
      }
    });

    // Fechar a última seção se existir
    if (currentSection) {
      output += "</div>";
    }

    return output;
  };

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full border-b bg-white">
        <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
        <TabsTrigger value="specifications" className="flex-1">Especificações</TabsTrigger>
        <TabsTrigger value="documents" className="flex-1">Documentos</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6 border rounded-lg overflow-hidden">
        <div 
          className="divide-y divide-neutral-100"
          dangerouslySetInnerHTML={{ 
            __html: formatDescription(product.description || "") 
          }}
        />
      </TabsContent>

      <TabsContent value="specifications" className="mt-6 border rounded-lg overflow-hidden">
        {product.technical_details && (
          <div className="divide-y divide-neutral-100">
            {Object.entries(product.technical_details).map(([key, value], index) => (
              <div 
                key={key} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
                }`}
              >
                <dt className="font-medium text-neutral-900 capitalize mb-1 sm:mb-0">
                  {key.replace(/_/g, ' ')}
                </dt>
                <dd className="text-neutral-600">{value as string}</dd>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents" className="mt-6 border rounded-lg p-6">
        {product.documents ? (
          <div className="space-y-4">
            {Object.entries(product.documents).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <FileText className="w-5 h-5" />
                {name}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-neutral-600">Nenhum documento disponível.</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
