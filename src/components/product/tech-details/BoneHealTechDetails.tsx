
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Award, Shield, Sparkles, ShieldCheck, Ruler, FileCheck } from "lucide-react";

interface BoneHealTechDetailsProps {
  dimensions: string;
  indication: string;
}

const BoneHealTechDetails = ({ dimensions, indication }: BoneHealTechDetailsProps) => {
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
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
          <Award className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="font-medium text-lg">Indicações</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-700">
            {indication || "Exodontias unitárias ou múltiplas, dependendo do tamanho da barreira."}
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
              <span className="ml-2">100% polipropileno, impermeável</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Composição:</span>
              <span className="ml-2">Filme de polipropileno</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Compatibilidade:</span>
              <span className="ml-2">Compatível com todos os sistemas de implantes, imediatos ou mediatos</span>
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

export default BoneHealTechDetails;
