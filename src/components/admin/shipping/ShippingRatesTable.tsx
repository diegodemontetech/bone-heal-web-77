
import React from "react";
import { ShippingRate } from "@/types/shipping";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface ShippingRatesTableProps {
  rates: ShippingRate[];
  onEdit: (rate: ShippingRate) => void;
  onDelete: (id: string) => void;
}

export const ShippingRatesTable: React.FC<ShippingRatesTableProps> = ({
  rates,
  onEdit,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Região</TableHead>
          <TableHead>Faixa de CEP</TableHead>
          <TableHead>Taxa Base</TableHead>
          <TableHead>Kg Adicional</TableHead>
          <TableHead>Prazo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map((rate) => (
          <TableRow key={rate.id}>
            <TableCell className="font-medium">{rate.region}</TableCell>
            <TableCell>
              {rate.zip_code_start?.substring(0, 5)}-{rate.zip_code_start?.substring(5)} a {rate.zip_code_end?.substring(0, 5)}-{rate.zip_code_end?.substring(5)}
            </TableCell>
            <TableCell>R$ {Number(rate.flat_rate).toFixed(2)}</TableCell>
            <TableCell>R$ {Number(rate.additional_kg_rate).toFixed(2)}</TableCell>
            <TableCell>{rate.estimated_days} dias</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                rate.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {rate.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onEdit(rate)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => onDelete(rate.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
