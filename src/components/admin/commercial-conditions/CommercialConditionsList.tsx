
import { useState } from "react";
import { Loader2, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CommercialCondition } from "@/types/commercial-conditions";

interface CommercialConditionsListProps {
  conditions: CommercialCondition[] | null;
  isLoading: boolean;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: (condition: CommercialCondition) => void;
}

const CommercialConditionsList = ({ 
  conditions, 
  isLoading, 
  onDelete,
  onToggle,
  onEdit
}: CommercialConditionsListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta condição comercial?")) {
      try {
        setDeletingId(id);
        const { error } = await supabase
          .from('commercial_conditions')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast.success("Condição comercial excluída com sucesso!");
        onDelete();
      } catch (error: any) {
        console.error("Erro ao excluir condição comercial:", error);
        toast.error("Erro ao excluir condição comercial");
      } finally {
        setDeletingId(null);
      }
    }
  };
  
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('commercial_conditions')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Condição ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`);
      onToggle();
    } catch (error: any) {
      console.error("Erro ao alterar status da condição:", error);
      toast.error("Erro ao alterar status da condição");
    }
  };
  
  const formatDiscountValue = (type: string, value: number) => {
    if (type === 'percentage') {
      return `${value}%`;
    } else if (type === 'fixed') {
      return formatCurrency(value);
    } else {
      return 'Frete Grátis';
    }
  };
  
  const formatRegion = (region: string | null) => {
    if (!region) return null;
    
    const regions: Record<string, string> = {
      'north': 'Norte',
      'northeast': 'Nordeste',
      'midwest': 'Centro-Oeste',
      'southeast': 'Sudeste',
      'south': 'Sul'
    };
    
    return regions[region] || region;
  };
  
  const formatCustomerGroup = (group: string | null) => {
    if (!group) return null;
    
    const groups: Record<string, string> = {
      'new': 'Novos clientes',
      'vip': 'Clientes VIP',
      'clinic': 'Clínicas',
      'hospital': 'Hospitais'
    };
    
    return groups[group] || group;
  };
  
  const formatPaymentMethod = (method: string | null) => {
    if (!method) return null;
    
    const methods: Record<string, string> = {
      'credit_card': 'Cartão de Crédito',
      'boleto': 'Boleto',
      'pix': 'PIX',
      'bank_transfer': 'Transferência Bancária'
    };
    
    return methods[method] || method;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Desconto</TableHead>
          <TableHead>Condições</TableHead>
          <TableHead>Segmentação</TableHead>
          <TableHead>Acumulável</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </TableCell>
          </TableRow>
        ) : conditions?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              Nenhuma condição comercial encontrada
            </TableCell>
          </TableRow>
        ) : (
          conditions?.map((condition) => (
            <TableRow key={condition.id}>
              <TableCell>
                <div className="flex items-center">
                  <Switch
                    checked={condition.is_active}
                    onCheckedChange={() => handleToggleActive(condition.id, condition.is_active)}
                    className="mr-2"
                  />
                  {condition.is_active ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  {condition.name}
                  {condition.description && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {condition.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={
                  condition.discount_type === 'percentage' ? 'outline' : 
                  condition.discount_type === 'fixed' ? 'secondary' : 
                  'default'
                }>
                  {formatDiscountValue(condition.discount_type, condition.discount_value)}
                </Badge>
                {condition.free_shipping && (
                  <Badge variant="outline" className="ml-2 bg-blue-50">
                    Frete Grátis
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  {condition.payment_method && (
                    <div>Pagamento: {formatPaymentMethod(condition.payment_method)}</div>
                  )}
                  {condition.min_amount && (
                    <div>Valor mínimo: {formatCurrency(condition.min_amount)}</div>
                  )}
                  {condition.min_items && (
                    <div>Itens mínimos: {condition.min_items}</div>
                  )}
                  {condition.valid_until && (
                    <div>Válido até: {new Date(condition.valid_until).toLocaleDateString('pt-BR')}</div>
                  )}
                  {!condition.payment_method && !condition.min_amount && !condition.min_items && !condition.valid_until && (
                    <span className="text-gray-500">Sem condições</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  {condition.region && (
                    <div>Região: {formatRegion(condition.region)}</div>
                  )}
                  {condition.customer_group && (
                    <div>Grupo: {formatCustomerGroup(condition.customer_group)}</div>
                  )}
                  {condition.product_id && (
                    <div>Produto específico</div>
                  )}
                  {condition.product_category && (
                    <div>Categoria: {condition.product_category}</div>
                  )}
                  {!condition.region && !condition.customer_group && !condition.product_id && !condition.product_category && (
                    <span className="text-gray-500">Sem segmentação</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {condition.is_cumulative ? (
                  <Badge variant="outline" className="bg-green-50">Sim</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50">Não</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(condition)}
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(condition.id)}
                    disabled={deletingId === condition.id}
                  >
                    {deletingId === condition.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CommercialConditionsList;
