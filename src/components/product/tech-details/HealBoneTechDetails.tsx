
import { CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HealBoneTechDetailsProps {
  dimensions: string;
  indication: string;
}

const HealBoneTechDetails = ({ dimensions, indication }: HealBoneTechDetailsProps) => {
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
            <TableCell>100% polipropileno, biocompatível, não-reabsorvível, impermeável</TableCell>
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
            <TableCell className="font-medium">Desenvolvido por</TableCell>
            <TableCell>Prof. Dr. Munir Salomão</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Descrição</h3>
        <p className="text-gray-700">
          Heal Bone® é uma película biocompatível, não-reabsorvível, impermeável, constituída 100% por um filme de polipropileno. 
          Projetada para permanecer exposta intencionalmente ao meio bucal, não apresenta porosidade em sua superfície, 
          o que lhe confere total impermeabilidade dificultando o acúmulo de detritos, restos alimentares e micro organismos em sua superfície.
        </p>
        
        <p className="text-gray-700">
          A barreira Heal Bone® utiliza apenas o coágulo sanguíneo, sem adição de enxertos ou implante de biomateriais de qualquer natureza, 
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
          A barreira não-reabsorvível Heal Bone® é indicada em todos os casos pós–exodontias, independentemente da causa, 
          principalmente quando houver perda de parede alveolar, nos casos de implantes imediatos e na correção de fenestrações ósseas.
        </p>
      </div>
    </div>
  );
};

export default HealBoneTechDetails;
