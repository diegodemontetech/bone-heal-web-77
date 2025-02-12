
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Play } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const formatDescription = (text: string) => {
    if (!text) return "";
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let inList = false;
    let formattedHtml = "";

    lines.forEach((line) => {
      if (line.startsWith("Características:") || 
          line.startsWith("Contraindicações:") || 
          line.includes("Registro ANVISA:")) {
        if (inList) {
          formattedHtml += "</ul>";
          inList = false;
        }
        formattedHtml += `<h3 class="font-semibold text-lg py-4 px-6 bg-neutral-100">${line}</h3>`;
      } else if (line.startsWith("•")) {
        if (!inList) {
          formattedHtml += '<ul class="divide-y divide-neutral-100">';
          inList = true;
        }
        formattedHtml += `
          <li class="flex px-6 py-3 bg-white">
            <span class="text-primary mr-2">•</span>
            <span class="text-neutral-600">${line.substring(1).trim()}</span>
          </li>`;
      } else {
        if (inList) {
          formattedHtml += "</ul>";
          inList = false;
        }
        formattedHtml += `<p class="px-6 py-3 bg-white text-neutral-600">${line}</p>`;
      }
    });

    if (inList) {
      formattedHtml += "</ul>";
    }

    return formattedHtml;
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
