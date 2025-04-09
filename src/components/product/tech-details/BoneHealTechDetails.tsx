
import { CheckCircle2, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BoneHealTechDetailsProps {
  dimensions: string;
  indication: string;
}

const BoneHealTechDetails = ({ dimensions, indication }: BoneHealTechDetailsProps) => {
  return (
    <div className="space-y-6">
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
            <TableCell>{dimensions}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Indicação</TableCell>
            <TableCell>{indication}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Registro ANVISA</TableCell>
            <TableCell>81197590000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Compatibilidade</TableCell>
            <TableCell>Compatível com todos os sistemas de implantes, imediatos ou mediatos</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Desenvolvido por</TableCell>
            <TableCell>Prof. Dr. Munir Salomão</TableCell>
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
            A barreira Bone Heal® é 100% impermeável, constituída por um filme de polipropileno, projetada para permanecer exposta ao meio bucal. Não apresenta porosidade em sua superfície, o que dificulta o acúmulo de detritos e micro-organismos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoneHealTechDetails;
