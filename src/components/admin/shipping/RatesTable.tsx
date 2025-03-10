
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { ShippingRate } from "./types";
import { ShippingRateRow } from "./ShippingRateRow";

interface RatesTableProps {
  shippingRates: ShippingRate[] | undefined;
  isLoading: boolean;
}

export const RatesTable = ({ shippingRates, isLoading }: RatesTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Estado</TableHead>
          <TableHead>Região</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Prazo</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shippingRates && shippingRates.length > 0 ? (
          shippingRates.map((rate) => (
            <ShippingRateRow key={rate.id} rate={rate} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Nenhuma taxa de frete encontrada. Utilize o botão "Importar Tabela Padrão" acima para importar taxas pré-configuradas.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
