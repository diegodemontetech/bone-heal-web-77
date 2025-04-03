
import { Product } from "@/types/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Info } from "lucide-react";

interface ProductTechDetailsProps {
  product: Product;
}

const ProductTechDetails = ({ product }: ProductTechDetailsProps) => {
  const isBoneHeal = product.name?.includes("Bone Heal");
  const isHealBone = product.name?.includes("Heal Bone");
  
  // Extract dimensions from product name if available
  const getDimensions = () => {
    const dimensionsMatch = product.name?.match(/(\d+)\s*[xX]\s*(\d+)/);
    if (dimensionsMatch && dimensionsMatch.length >= 3) {
      return `${dimensionsMatch[1]}mm x ${dimensionsMatch[2]}mm`;
    }
    
    // If not in name, check common dimensions
    if (product.name?.includes("15x40") || product.name?.includes("15 x 40")) {
      return "15mm x 40mm";
    } else if (product.name?.includes("20x30") || product.name?.includes("20 x 30")) {
      return "20mm x 30mm";
    } else if (product.name?.includes("30x40") || product.name?.includes("30 x 40")) {
      return "30mm x 40mm";
    }
    
    return "Consulte embalagem";
  };
  
  // Get indicação based on dimensions
  const getIndicacao = () => {
    if (product.name?.includes("15x40") || product.name?.includes("15 x 40")) {
      return "Indicado para defeitos correspondentes a exodontia unitária.";
    } else if (product.name?.includes("20x30") || product.name?.includes("20 x 30")) {
      return "Indicado para defeitos correspondentes a exodontia de 2 elementos contíguos.";
    } else if (product.name?.includes("30x40") || product.name?.includes("30 x 40")) {
      return "Indicado para defeitos correspondentes a exodontia de 3 a 4 elementos contíguos.";
    }
    
    return "Consulte a embalagem para indicações específicas.";
  };

  // Helper function to safely render a value as string
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const renderBoneHealDetails = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Detalhes Técnicos</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Característica</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Material</TableCell>
            <TableCell>100% polipropileno, impermeável</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Dimensões</TableCell>
            <TableCell>{getDimensions()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Indicação</TableCell>
            <TableCell>{getIndicacao()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Registro ANVISA</TableCell>
            <TableCell>81197590000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Compatibilidade</TableCell>
            <TableCell>Compatível com todos os sistemas de implantes, imediatos ou mediatos</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Características Principais</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Dispensa o uso de enxertos e/ou biomateriais. Todavia, fica a critério do Cirurgião o uso desses materiais, alterando o tempo mínimo de remoção para 30 dias.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Dispensa o uso de parafusos, tachinhas ou qualquer artefato de fixação, podendo ser usado com qualquer fio de sutura.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Por ser exposta ao meio bucal, as suturas não exercem pressão sobre a barreira, portanto, elimina os problemas decorrentes das deiscências de suturas.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Técnica cirúrgica simples de ser executada, sendo removida sem necessidade de anestesia e segunda cirurgia.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Não adere aos tecidos.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Reduz a morbidade.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Aumenta o conforto pós-operatório.</span>
          </li>
        </ul>
      </div>
      
      <div className="mt-4 rounded-md bg-blue-50 p-4 border border-blue-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            A barreira Bone Heal é 100% impermeável, constituída por um filme de polipropileno, projetada para permanecer exposta ao meio bucal. Não apresenta porosidade em sua superfície, o que dificulta o acúmulo de detritos e micro-organismos.
          </p>
        </div>
      </div>
    </div>
  );
  
  const renderHealBoneDetails = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Detalhes Técnicos</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Característica</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Material</TableCell>
            <TableCell>100% polipropileno, biocompatível, não-reabsorvível, impermeável</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Dimensões</TableCell>
            <TableCell>{getDimensions()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Indicação</TableCell>
            <TableCell>{getIndicacao()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Registro ANVISA</TableCell>
            <TableCell>81197590000</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Descrição</h3>
        <p className="text-gray-700">
          Heal Bone é uma película biocompatível, não-reabsorvível, impermeável, constituída 100% por um filme de polipropileno. 
          Projetada para permanecer exposta intencionalmente ao meio bucal, não apresenta porosidade em sua superfície, 
          o que lhe confere total impermeabilidade dificultando o acúmulo de detritos, restos alimentares e micro organismos em sua superfície.
        </p>
        
        <p className="text-gray-700">
          A barreira Heal Bone utiliza apenas o coágulo sanguíneo, sem adição de enxertos ou implante de biomateriais de qualquer natureza, 
          é possível solucionar problemas complexos através de uma técnica cirúrgica simples, segura e previsível, 
          objetivando a regeneração simultânea tanto do tecido ósseo quanto dos tecidos moles.
        </p>
      </div>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Vantagens</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Elimina os problemas decorrentes das deiscências de suturas</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Elimina a necessidade de outros biomateriais</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Reduz a morbidade, aumenta o conforto pós-operatório</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Reduz a necessidade de liberação de grandes retalhos</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Elimina o risco das infecções decorrentes de enxertos</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Promove o aumento do volume de tecido ósseo para inserção do implante</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Regeneração tanto do tecido ósseo quanto do tecido mole</span>
          </li>
        </ul>
      </div>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Indicações</h3>
        <p className="text-gray-700">
          A barreira não-reabsorvível Heal Bone é indicada em todos os casos pós–exodontias, independentemente da causa, 
          principalmente quando houver perda de parede alveolar, nos casos de implantes imediatos e na correção de fenestrações ósseas.
        </p>
      </div>
    </div>
  );
  
  // Default tech details if no specific product type is detected
  const renderDefaultDetails = () => {
    if (product.technical_details) {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Detalhes Técnicos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Característica</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(product.technical_details).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>{renderValue(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Detalhes técnicos não disponíveis para este produto.</p>
      </div>
    );
  };

  return (
    <div className="mt-10">
      {isBoneHeal ? renderBoneHealDetails() : 
       isHealBone ? renderHealBoneDetails() : 
       renderDefaultDetails()}
    </div>
  );
};

export default ProductTechDetails;
