
import { Product } from "@/types/product";
import { parseTechnicalDetails } from "@/types/custom-supabase";

interface ProductTechDetailsProps {
  product: Product;
}

// Componente simplificado para mostrar detalhes técnicos
const ProductTechDetails = ({ product }: ProductTechDetailsProps) => {
  const techDetails = parseTechnicalDetails(product.technical_details);
  const productName = product.name || "";
  
  // Determine o tipo de produto
  const isBoneHeal = productName.toLowerCase().includes("bone heal");
  const isHealBone = productName.toLowerCase().includes("heal bone");
  
  // Extrair informações comuns
  const dimensions = techDetails.dimensions || "Não especificado";
  const composition = techDetails.composicao || "100% polipropileno";
  const indications = techDetails.indicacoes || "Regeneração óssea guiada";
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Tipo de Produto</h3>
          <p>{isBoneHeal ? "Bone Heal®" : isHealBone ? "Heal Bone®" : "Membrana Regenerativa"}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Dimensões</h3>
          <p>{dimensions}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Composição</h3>
          <p>{composition}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Indicações</h3>
          <p>{indications}</p>
        </div>
      </div>
      
      {/* Informações adicionais baseadas no tipo de produto */}
      <div className="border-t pt-6">
        <h3 className="font-bold text-lg mb-4">Características do Produto</h3>
        {isBoneHeal && (
          <ul className="list-disc pl-5 space-y-2">
            <li>Barreira não absorvível 100% impermeável</li>
            <li>Não necessita de parafusos ou fixações</li>
            <li>Pode ser deixada exposta intencionalmente</li>
            <li>Remove-se facilmente sem anestesia</li>
            <li>Elimina a necessidade de segundo tempo cirúrgico</li>
            <li>Dispensa o uso de enxertos e biomateriais</li>
          </ul>
        )}
        
        {isHealBone && (
          <ul className="list-disc pl-5 space-y-2">
            <li>Película biocompatível não-reabsorvível</li>
            <li>Projetada para permanecer exposta ao meio bucal</li>
            <li>Não apresenta porosidade em sua superfície</li>
            <li>Utiliza apenas o coágulo sanguíneo</li>
            <li>Elimina problemas de deiscência</li>
            <li>Aumenta o conforto pós-operatório</li>
          </ul>
        )}
        
        {!isBoneHeal && !isHealBone && (
          <p className="text-gray-600">
            Informações detalhadas não disponíveis para este produto. 
            Entre em contato com nosso suporte para mais detalhes.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductTechDetails;
