
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Play } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const formatDescription = (text: string) => {
    if (!text) return "";
    
    let output = "";
    
    // Primeira seção - Nome do produto
    output += `
      <div class="px-6 py-4 bg-white">
        <h2 class="text-2xl font-bold text-neutral-900 mb-6">${product.name}</h2>
      </div>
    `;

    // Processamento das seções principais
    const mainSections = ["Características:", "Contraindicações:", "Registro ANVISA:"];
    
    mainSections.forEach(sectionTitle => {
      const sectionRegex = new RegExp(`${sectionTitle}([\\s\\S]*?)(?=(${mainSections.join('|')})|$)`);
      const match = text.match(sectionRegex);
      
      if (match) {
        output += `
          <div class="border-t">
            <h3 class="text-xl font-semibold bg-neutral-100 px-6 py-4">${sectionTitle}</h3>
            <div class="py-2">
        `;
        
        // Processar o conteúdo da seção
        const content = match[1].trim();
        const items = content.split(/[•\n]/).map(item => item.trim()).filter(Boolean);
        
        items.forEach(item => {
          if (item.includes(":")) {
            const [title, content] = item.split(":");
            output += `
              <div class="px-6 py-3 bg-white flex flex-col sm:flex-row gap-2">
                <span class="font-medium text-neutral-900 sm:w-1/3">${title.trim()}:</span>
                <span class="text-neutral-600 sm:w-2/3">${content.trim()}</span>
              </div>
            `;
          } else {
            output += `
              <div class="px-6 py-3 bg-white flex items-start">
                <span class="text-primary mr-3 font-bold">•</span>
                <span class="text-neutral-600">${item}</span>
              </div>
            `;
          }
        });
        
        output += `
            </div>
          </div>
        `;
      }
    });
    
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
                className="flex flex-col sm:flex-row sm:items-center p-4 bg-white"
              >
                <dt className="font-medium text-neutral-900 capitalize mb-1 sm:mb-0 sm:w-1/3">
                  {key.replace(/_/g, ' ')}
                </dt>
                <dd className="text-neutral-600 sm:w-2/3">{value as string}</dd>
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
