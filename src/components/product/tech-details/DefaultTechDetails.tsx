
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DefaultTechDetailsProps {
  technicalDetails: Record<string, any> | null | undefined;
}

const DefaultTechDetails = ({ technicalDetails }: DefaultTechDetailsProps) => {
  // Helper function to safely render a value as string
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (!technicalDetails || Object.keys(technicalDetails).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Detalhes técnicos não disponíveis para este produto.</p>
      </div>
    );
  }

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
          {Object.entries(technicalDetails).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell>{renderValue(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DefaultTechDetails;
