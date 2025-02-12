
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Play } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const formatDescription = (text: string) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        if (line.startsWith("•")) {
          return `<li class="ml-6 mb-2">${line.substring(1).trim()}</li>`;
        }
        if (line.startsWith("Características:") || 
            line.startsWith("Contraindicações:") || 
            line.includes("Registro ANVISA:")) {
          return `<h3 class="font-semibold text-lg mt-6 mb-4">${line}</h3>`;
        }
        return `<p class="mb-4">${line}</p>`;
      })
      .join("");
  };

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full border-b">
        <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
        <TabsTrigger value="specifications" className="flex-1">Especificações</TabsTrigger>
        <TabsTrigger value="documents" className="flex-1">Documentos</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div 
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatDescription(product.description || "") 
          }}
        />
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        {product.technical_details && (
          <div className="space-y-4">
            {Object.entries(product.technical_details).map(([key, value]) => (
              <div key={key} className="border-b pb-4">
                <dt className="font-medium text-neutral-900 mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </dt>
                <dd className="text-neutral-600">{value as string}</dd>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
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
