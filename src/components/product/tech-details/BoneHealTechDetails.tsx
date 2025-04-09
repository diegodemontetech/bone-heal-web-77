
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
            <TableCell className="font-medium">Composição</TableCell>
            <TableCell>Filme de polipropileno</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Características</TableCell>
            <TableCell>Não adere aos tecidos, reduz a morbidade, aumenta o conforto pós-operatório</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Compatibilidade</TableCell>
            <TableCell>Compatível com todos os sistemas de implantes, imediatos ou mediatos</TableCell>
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
            <TableCell>Simples, sendo removida sem necessidade de anestesia e segunda cirurgia</TableCell>
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

export default BoneHealTechDetails;
