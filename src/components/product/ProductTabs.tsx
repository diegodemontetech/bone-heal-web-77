
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
            ${product.description || ''}
          </p>
        </div>

        <!-- Características -->
        <div class="px-6">
          <h3 class="text-lg font-semibold mb-4">Características</h3>
          <div class="space-y-3">
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Não necessita de segunda cirurgia para remoção</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Atóxica e biocompatível</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Mantém o espaço necessário para neoformação óssea</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Adaptável e de fácil manipulação</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Superfície lisa (não aderente)</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Alta resistência mecânica</span>
            </div>
          </div>
        </div>

        <!-- Indicações -->
        <div class="px-6">
          <h3 class="text-lg font-semibold mb-4">Indicações</h3>
          <div class="space-y-3">
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Regeneração óssea guiada</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Preservação alveolar</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Regeneração tecidual guiada</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Levantamento de seio maxilar</span>
            </div>
          </div>
        </div>

        <!-- Contraindicações -->
        <div class="px-6">
          <h3 class="text-lg font-semibold mb-4">Contraindicações</h3>
          <div class="space-y-3">
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Pacientes que apresentem quadro de infecção ativa no local</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary mr-3 mt-1.5">•</span>
              <span class="text-neutral-600">Cobertura primária insuficiente dos tecidos moles</span>
            </div>
          </div>
        </div>

        <!-- Registro ANVISA -->
        <div class="px-6">
          <h3 class="text-lg font-semibold mb-4">Registro ANVISA</h3>
          <p class="text-neutral-600">
            81832580001
          </p>
        </div>
      </div>
    `;

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
