import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Play } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
        <TabsTrigger value="technical" className="flex-1">Especificações</TabsTrigger>
        <TabsTrigger value="documents" className="flex-1">Documentos</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-4">
        <div className="prose prose-neutral max-w-none">
          {product.full_description || product.description}
        </div>
      </TabsContent>

      <TabsContent value="technical" className="mt-4">
        {product.technical_details && (
          <div className="space-y-4">
            {Object.entries(product.technical_details).map(([key, value]) => (
              <div key={key} className="border-b pb-2">
                <dt className="font-medium text-neutral-900">{key}</dt>
                <dd className="text-neutral-600">{value as string}</dd>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        {product.documents && (
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
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;