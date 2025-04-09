
import { Check } from "lucide-react";
import { Product } from "@/types/product";

interface ProductBulletPointsProps {
  product: Product;
}

const ProductBulletPoints = ({ product }: ProductBulletPointsProps) => {
  // Extrair características do produto do technical_details ou criar padrão
  const bulletPoints = product.technical_details?.bullet_points || 
    generateDefaultBulletPoints(product);

  return (
    <div className="bg-gray-50 p-4 rounded-lg my-6">
      <h3 className="text-lg font-semibold mb-4">Características do Produto</h3>
      <ul className="space-y-2">
        {bulletPoints.map((point: string, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Gera bullets padrão com base nas informações do produto quando não temos bullets específicos
const generateDefaultBulletPoints = (product: Product): string[] => {
  const bulletPoints = [];
  
  if (product.name?.toLowerCase().includes("bone heal")) {
    bulletPoints.push("Barreira de polipropileno não absorvível 100% impermeável");
    bulletPoints.push("Técnica cirúrgica simplificada, sem necessidade de segunda cirurgia");
    bulletPoints.push("Dispensa o uso de enxertos, biomateriais e parafusos");
    bulletPoints.push("Não adere aos tecidos, reduzindo a morbidade");
    bulletPoints.push("Compatível com todos os sistemas de implantes");
  } else if (product.name?.toLowerCase().includes("heal bone")) {
    bulletPoints.push("Película biocompatível 100% em polipropileno");
    bulletPoints.push("Projetada para permanecer exposta ao meio bucal");
    bulletPoints.push("Utiliza apenas o coágulo sanguíneo, sem biomateriais");
    bulletPoints.push("Elimina problemas de deiscência de sutura");
    bulletPoints.push("Ideal para todos os casos pós-exodontias");
  } else {
    bulletPoints.push("Produto de alta qualidade para regeneração óssea");
    bulletPoints.push("Desenvolvido com tecnologia exclusiva");
    bulletPoints.push("Segurança e eficácia clinicamente comprovadas");
    bulletPoints.push("Registrado na ANVISA");
  }
  
  // Adicionar dimensões se disponíveis
  if (product.length && product.width) {
    bulletPoints.push(`Dimensões: ${product.length}mm x ${product.width}mm`);
  }
  
  return bulletPoints;
};

export default ProductBulletPoints;
