
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { StageItem } from "./StageItem";

interface StagesListProps {
  stages: Array<{
    id: string;
    name: string;
    color: string;
    department: string;
    order: number;
  }>;
  onEdit: (stage: any) => void;
  onDelete: (id: string) => void;
}

export const StagesList = ({ stages, onEdit, onDelete }: StagesListProps) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stages.map((stage) => (
            <StageItem
              key={stage.id}
              stage={stage}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
