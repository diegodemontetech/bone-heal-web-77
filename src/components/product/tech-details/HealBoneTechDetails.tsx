
import { Check, Award, Shield, Sparkles, ShieldCheck, Ruler, Waypoints, FileCheck } from "lucide-react";

interface HealBoneTechDetailsProps {
  dimensions: string;
  indication: string;
}

const HealBoneTechDetails = ({ dimensions, indication }: HealBoneTechDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Lote Promocional: Valid 05/25</h3>
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
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Award className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="font-medium text-lg">Indicações</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-700">
            A barreira não-reabsorvível Heal Bone® é indicada em todos os casos pós–exodontias, 
            independentemente da causa, principalmente quando houver perda de parede alveolar, 
            nos casos de implantes imediatos e na correção de fenestrações ósseas.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Ruler className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="font-medium text-lg">Especificações Técnicas</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Material:</span>
              <span className="ml-2">100% polipropileno, biocompatível, não-reabsorvível, impermeável</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Técnica:</span>
              <span className="ml-2">Simples, segura e previsível</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Ruler className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Dimensões:</span>
              <span className="ml-2">{dimensions}</span>
            </div>
          </div>
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
    </div>
  );
};

export default HealBoneTechDetails;
