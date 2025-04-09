
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Award, Shield, Sparkles, ShieldCheck, Ruler, FileCheck, Info, AlertTriangle, Beaker, Circle } from "lucide-react";

interface BoneHealTechDetailsProps {
  dimensions: string;
  indication: string;
}

const BoneHealTechDetails = ({ dimensions, indication }: BoneHealTechDetailsProps) => {
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
            Bone Heal® é uma barreira 100% impermeável, fabricada em polipropileno, que permite a regeneração óssea guiada
            sem o uso de enxertos ou biomateriais, apenas com o coágulo sanguíneo.
          </p>
          <p>
            Compatível com todos os sistemas de implantes, imediatos ou mediatos, dispensa o uso de parafusos, tachinhas
            ou qualquer artefato de fixação, podendo ser usada com qualquer fio de sutura.
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
                {indication || "Exodontias unitárias ou múltiplas, dependendo do tamanho da barreira."}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Instructions</div>
              <p>
                Hidratar antes do uso. Posicionar a barreira sobre o alvéolo com a porção mais longa voltada para vestibular.
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
              <p>100% polipropileno, impermeável</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Circle className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Composition</div>
              <p>Filme de polipropileno</p>
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
              <span>Por ser exposta ao meio bucal, elimina os problemas decorrentes das deiscências de suturas</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Técnica cirúrgica simples, sendo removida sem necessidade de anestesia e segunda cirurgia</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Não adere aos tecidos</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Reduz a morbidade</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Aumenta o conforto pós-operatório</span>
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

export default BoneHealTechDetails;
