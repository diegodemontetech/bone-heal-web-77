
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
            <TableCell className="font-medium">Composição</TableCell>
            <TableCell>Película de polipropileno sem porosidade</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Características</TableCell>
            <TableCell>Elimina problemas de deiscência, reduz morbidade, aumenta conforto pós-operatório</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Indicações</TableCell>
            <TableCell>{indication}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Dimensões</TableCell>
            <TableCell>{dimensions}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Técnica</TableCell>
            <TableCell>Simples, segura e previsível</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Vantagens</TableCell>
            <TableCell>Elimina a necessidade de outros biomateriais, reduz a necessidade de liberação de grandes retalhos</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Desenvolvido por</TableCell>
            <TableCell>Prof. Dr. Munir Salomão</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Registro ANVISA</TableCell>
            <TableCell>81197590000</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default HealBoneTechDetails;
