
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Award, Shield, Sparkles, ShieldCheck, Ruler, FileCheck, Info, AlertTriangle, Beaker, Circle } from "lucide-react";

interface HealBoneTechDetailsProps {
  dimensions: string;
  indication: string;
}

const HealBoneTechDetails = ({ dimensions, indication }: HealBoneTechDetailsProps) => {
  // Extrair os valores de largura e altura das dimensões
  const dimensionMatch = dimensions.match(/(\d+)\s*[xX]\s*(\d+)/);
  const width = dimensionMatch ? dimensionMatch[1] : "20";
  const height = dimensionMatch ? dimensionMatch[2] : "30";

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Descrição</h3>
        <div className="text-gray-700 space-y-4">
          <p>
            Heal Bone® é uma película biocompatível, não-reabsorvível, impermeável, constituída 100% por um filme de polipropileno. 
            Projetada para permanecer exposta intencionalmente ao meio bucal, não apresenta porosidade em sua superfície, 
            o que lhe confere total impermeabilidade dificultando o acúmulo de detritos, restos alimentares e micro organismos 
            em sua superfície.
          </p>
          <p>
            A barreira Heal Bone® utiliza apenas o coágulo sanguíneo, sem adição de enxertos ou implante de biomateriais 
            de qualquer natureza, é possível solucionar problemas complexos através de uma técnica cirúrgica simples, 
            segura e previsível, objetivando a regeneração simultânea tanto do tecido ósseo quanto dos tecidos moles.
          </p>
        </div>
      </div>
      
      {/* Uso e Aplicação */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Info className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="font-medium text-lg">Uso e Aplicação</h3>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Indication</div>
              <p>
                {indication || "A barreira não-reabsorvível Heal Bone® é indicada em todos os casos pós–exodontias, independentemente da causa, principalmente quando houver perda de parede alveolar, nos casos de implantes imediatos e na correção de fenestrações ósseas."}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Instructions</div>
              <p>
                Posicionar a barreira sobre o alvéolo com a porção mais longa voltada para vestibular.
                Suturar a barreira ao retalho utilizando fio cirúrgico.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Contraindication</div>
              <p>Pacientes com infecções ativas</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Materiais e Composição */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Beaker className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="font-medium text-lg">Materiais e Composição</h3>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Material</div>
              <p>100% polipropileno, biocompatível, não-reabsorvível, impermeável</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Composition</div>
              <p>Película de polipropileno sem porosidade</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dimensões */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Ruler className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="font-medium text-lg">Dimensões</h3>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Width</div>
              <p>{width}mm</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Height</div>
              <p>{height}mm</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vantagens */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Shield className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="font-medium text-lg">Vantagens</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Elimina os problemas decorrentes das deiscências de suturas</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Elimina a necessidade de outros biomateriais</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Reduz a morbidade, aumenta o conforto pós-operatório</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Reduz a necessidade de liberação de grandes retalhos</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Elimina o risco das infecções decorrentes de enxertos</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Promove o aumento do volume de tecido ósseo para inserção do implante</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Regeneração tanto do tecido ósseo quanto do tecido mole</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Tamanhos Disponíveis */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Ruler className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="font-medium text-lg">Tamanhos Disponíveis</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>15 x 40 mm</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>20 x 30 mm</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>30 x 40 mm</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Informações Regulatórias */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <FileCheck className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="font-medium text-lg">Informações Regulatórias</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <FileCheck className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Registro ANVISA:</span>
              <span className="ml-2">81197590000</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Desenvolvido por:</span>
              <span className="ml-2">Prof. Dr. Munir Salomão</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealBoneTechDetails;
