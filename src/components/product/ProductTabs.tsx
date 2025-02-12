
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const formatDescription = (text: string) => {
    if (!text) return "";
    
    // Remover caracteres especiais e espaços extras
    const cleanText = text.replace(/\\[nr]/g, '').trim();
    
    let output = `
      <div class="space-y-8">
        <!-- Título Principal -->
        <div class="px-6 py-4">
          <h2 class="text-2xl font-bold text-neutral-900">${product.name}</h2>
        </div>

        <!-- Descrição -->
        <div class="px-6">
          <h3 class="text-lg font-semibold mb-4">Descrição</h3>
          <p class="text-neutral-600">
            Película utilizada como barreira para regeneração óssea guiada. 
            Constituída 100% por polipropileno com tratamento de superfície.
          </p>
        </div>
    `;

    // Seções principais com seus conteúdos
    const sections = [
      {
        title: "Características",
        content: cleanText.match(/Características:(.*?)(?=Contraindicações:|$)/s)?.[1] || ""
      },
      {
        title: "Contraindicações",
        content: cleanText.match(/Contraindicações:(.*?)(?=Registro ANVISA:|$)/s)?.[1] || ""
      },
      {
        title: "Registro ANVISA",
        content: cleanText.match(/Registro ANVISA:(.*?)$/s)?.[1] || ""
      }
    ];

    // Processar cada seção
    sections.forEach(section => {
      const items = section.content
        .split(/[•\n]/)
        .map(item => item.trim())
        .filter(Boolean);

      if (items.length > 0) {
        output += `
          <div class="px-6">
            <h3 class="text-lg font-semibold mb-4">${section.title}</h3>
            <div class="space-y-3">
        `;

        items.forEach(item => {
          if (section.title === "Registro ANVISA") {
            output += `
              <p class="text-neutral-600">${item}</p>
            `;
          } else {
            output += `
              <div class="flex items-start">
                <span class="text-primary mr-3 mt-1.5">•</span>
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

    output += "</div>";
    return output;
  };

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full border-b bg-white">
        <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
        <TabsTrigger value="specifications" className="flex-1">Especificações</TabsTrigger>
        <TabsTrigger value="documents" className="flex-1">Documentos</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6 border rounded-lg overflow-hidden bg-white">
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
            {Object.entries(product.technical_details).map(([key, value]) => (
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
