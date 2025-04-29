
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Waypoints, 
  Ruler, 
  Award, 
  FileCheck 
} from "lucide-react";
import { Product } from "@/types/product";
import { extractDimensionsFromName } from "./tech-details/utils/dimensionsFormatter";
import { Json } from "@/integrations/supabase/types";

interface ProductBulletPointsProps {
  product: Product;
}

const ProductBulletPoints = ({ product }: ProductBulletPointsProps) => {
  // Safely extract bullet points from technical_details, handling both object and string formats
  const getBulletPoints = () => {
    const techDetails = product.technical_details;
    
    // If technical_details is a string, try to parse it
    if (typeof techDetails === 'string') {
      try {
        const parsed = JSON.parse(techDetails);
        return parsed.bullet_points || generateDefaultBulletPoints(product);
      } catch (e) {
        console.warn('Failed to parse technical_details as JSON:', e);
        return generateDefaultBulletPoints(product);
      }
    }
    
    // If technical_details is an object, access bullet_points property
    if (techDetails && typeof techDetails === 'object') {
      return techDetails.bullet_points || generateDefaultBulletPoints(product);
    }
    
    // Default case
    return generateDefaultBulletPoints(product);
  };
  
  const bulletPoints = getBulletPoints();

  return (
    <div className="bg-gray-50 p-5 rounded-lg my-6">
      <h3 className="text-xl font-semibold mb-4">Características do Produto</h3>
      <ul className="space-y-4">
        {bulletPoints.map((point: string, index: number) => {
          const icon = getBulletIcon(point, index);
          return (
            <li key={index} className="flex items-start gap-3">
              <div className="h-6 w-6 text-primary mt-0.5 flex-shrink-0">
                {icon}
              </div>
              <span className="text-gray-700">{formatBulletPoint(point)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Retorna o ícone apropriado com base no conteúdo do bullet point
const getBulletIcon = (point: string, index: number) => {
  const lowerPoint = point.toLowerCase();
  
  if (lowerPoint.includes("dimensões")) return <Ruler className="h-5 w-5" />;
  if (lowerPoint.includes("barreira") || lowerPoint.includes("impermeável")) return <ShieldCheck className="h-5 w-5" />;
  if (lowerPoint.includes("técnica") || lowerPoint.includes("cirurgia")) return <Sparkles className="h-5 w-5" />;
  if (lowerPoint.includes("dispensa") || lowerPoint.includes("enxertos")) return <CheckCircle2 className="h-5 w-5" />;
  if (lowerPoint.includes("não adere")) return <Waypoints className="h-5 w-5" />;
  if (lowerPoint.includes("compatível")) return <CheckCircle2 className="h-5 w-5" />;
  if (lowerPoint.includes("resultados") || lowerPoint.includes("regeneração")) return <Award className="h-5 w-5" />;
  if (lowerPoint.includes("registrado")) return <FileCheck className="h-5 w-5" />;
  
  // Ícone padrão para outros casos
  return <CheckCircle2 className="h-5 w-5" />;
};

// Formata o texto do bullet point para melhorar a legibilidade
const formatBulletPoint = (point: string): string => {
  // Garante que o texto comece com maiúscula e tenha pontuação adequada
  let formatted = point.trim();
  
  // Capitaliza primeira letra se não estiver capitalizada
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  
  // Adiciona ponto final se necessário
  if (!formatted.endsWith('.') && !formatted.endsWith(':')) {
    formatted += '.';
  }
  
  return formatted;
};

// Gera bullets padrão com base nas informações do produto quando não temos bullets específicos
const generateDefaultBulletPoints = (product: Product): string[] => {
  const bulletPoints = [];
  const dimensions = extractDimensionsFromName(product.name);
  
  if (product.name?.toLowerCase().includes("bone heal")) {
    bulletPoints.push("Barreira de polipropileno não absorvível 100% impermeável");
    bulletPoints.push("Técnica cirúrgica simplificada, sem necessidade de segunda cirurgia");
    bulletPoints.push("Dispensa o uso de enxertos, biomateriais e parafusos");
    bulletPoints.push("Não adere aos tecidos, reduzindo a morbidade");
    bulletPoints.push("Compatível com todos os sistemas de implantes");
    bulletPoints.push("Excelentes resultados em regeneração óssea guiada");
    bulletPoints.push(`Dimensões: ${dimensions}`);
  } else if (product.name?.toLowerCase().includes("heal bone")) {
    bulletPoints.push("Película biocompatível 100% em polipropileno");
    bulletPoints.push("Projetada para permanecer exposta ao meio bucal");
    bulletPoints.push("Utiliza apenas o coágulo sanguíneo, sem biomateriais");
    bulletPoints.push("Elimina problemas de deiscência de sutura");
    bulletPoints.push("Ideal para todos os casos pós-exodontias");
    bulletPoints.push("Regeneração tanto do tecido ósseo quanto do tecido mole");
    bulletPoints.push(`Dimensões: ${dimensions}`);
  } else {
    bulletPoints.push("Produto de alta qualidade para regeneração óssea");
    bulletPoints.push("Desenvolvido com tecnologia exclusiva");
    bulletPoints.push("Segurança e eficácia clinicamente comprovadas");
    bulletPoints.push("Registrado na ANVISA");
    
    // Adicionar dimensões se disponíveis no nome do produto
    if (dimensions !== "Consulte embalagem") {
      bulletPoints.push(`Dimensões: ${dimensions}`);
    }
  }
  
  return bulletPoints;
};

export default ProductBulletPoints;
