
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { fieldTypes, Field } from "./types";

interface FieldsTableProps {
  fields: Field[];
  onEdit: (field: Field) => void;
  onDelete: (id: string) => void;
}

export const FieldsTable = ({ fields, onEdit, onDelete }: FieldsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Obrigatório</TableHead>
          <TableHead>No Cartão</TableHead>
          <TableHead>No Kanban</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field) => (
          <TableRow key={field.id}>
            <TableCell className="font-medium">{field.name}</TableCell>
            <TableCell>{fieldTypes.find(t => t.id === field.type)?.name || field.type}</TableCell>
            <TableCell>{field.department}</TableCell>
            <TableCell>{field.required ? "Sim" : "Não"}</TableCell>
            <TableCell>{field.showInCard ? "Sim" : "Não"}</TableCell>
            <TableCell>{field.showInKanban ? "Sim" : "Não"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(field)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(field.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
