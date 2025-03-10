
import { Loader2, Trash2, Edit, Eye, Power } from "lucide-react";
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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import CommercialConditionDialog from "./CommercialConditionDialog";

interface CommercialCondition {
  id: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  payment_method: string | null;
  min_amount: number | null;
  min_items: number | null;
  valid_until: string | null;
  region: string | null;
  customer_group: string | null;
  free_shipping: boolean;
}

interface CommercialConditionsListProps {
  conditions: CommercialCondition[] | null;
  isLoading: boolean;
  onDelete: () => void;
  onToggle: () => void;
}

const CommercialConditionsList = ({ 
  conditions, 
  isLoading, 
  onDelete,
  onToggle 
}: CommercialConditionsListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editCondition, setEditCondition] = useState<CommercialCondition | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('commercial_conditions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Condição comercial excluída com sucesso!");
      onDelete();
    } catch (error) {
      console.error("Erro ao excluir condição comercial:", error);
      toast.error("Erro ao excluir condição comercial");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('commercial_conditions')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Condição comercial ${!currentState ? 'ativada' : 'desativada'} com sucesso!`);
      onToggle();
    } catch (error) {
      console.error("Erro ao atualizar condição comercial:", error);
      toast.error("Erro ao atualizar condição comercial");
    } finally {
      setUpdatingId(null);
    }
  };
  
  const formatDiscountType = (type: string, value: number) => {
    switch(type) {
      case 'percentage':
        return <Badge variant="outline" className="bg-blue-50">{value}%</Badge>;
      case 'fixed':
        return <Badge variant="outline" className="bg-green-50">R$ {value.toFixed(2)}</Badge>;
      case 'shipping':
        return <Badge variant="outline" className="bg-amber-50">Frete Grátis</Badge>;
      default:
        return value;
    }
  };

  const formatPaymentMethod = (method: string | null) => {
    if (!method) return "Qualquer";
    switch(method) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'boleto': return 'Boleto';
      case 'pix': return 'PIX';
      default: return method;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Desconto</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Condições</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : conditions?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nenhuma condição comercial encontrada
              </TableCell>
            </TableRow>
          ) : (
            conditions?.map((condition) => (
              <TableRow key={condition.id} className={!condition.is_active ? "opacity-60" : ""}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{condition.name}</span>
                    {condition.description && (
                      <span className="text-xs text-muted-foreground">{condition.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDiscountType(condition.discount_type, condition.discount_value)}
                </TableCell>
                <TableCell>
                  {condition.valid_until ? (
                    new Date(condition.valid_until).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  ) : (
                    <span className="text-gray-500">Sem limite</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    {condition.payment_method && (
                      <span className="whitespace-nowrap">
                        Pagamento: {formatPaymentMethod(condition.payment_method)}
                      </span>
                    )}
                    {condition.min_amount && (
                      <span className="whitespace-nowrap">
                        Min: R$ {condition.min_amount.toFixed(2)}
                      </span>
                    )}
                    {condition.min_items && (
                      <span className="whitespace-nowrap">
                        Min: {condition.min_items} {condition.min_items === 1 ? 'item' : 'itens'}
                      </span>
                    )}
                    {condition.region && (
                      <span className="whitespace-nowrap">
                        Região: {condition.region}
                      </span>
                    )}
                    {condition.customer_group && (
                      <span className="whitespace-nowrap">
                        Grupo: {condition.customer_group}
                      </span>
                    )}
                    {condition.free_shipping && (
                      <span className="whitespace-nowrap text-green-600">
                        Frete grátis
                      </span>
                    )}
                    {!condition.payment_method && !condition.min_amount && !condition.min_items && 
                     !condition.region && !condition.customer_group && !condition.free_shipping && (
                      <span className="text-gray-500">Sem condições</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={condition.is_active} 
                    disabled={updatingId === condition.id}
                    onCheckedChange={() => handleToggleActive(condition.id, condition.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditCondition(condition)}
                    >
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(condition.id)}
                      disabled={deletingId === condition.id}
                    >
                      {deletingId === condition.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editCondition && (
        <CommercialConditionDialog 
          condition={editCondition} 
          onSuccess={() => {
            setEditCondition(null);
            onToggle();
          }} 
          onCancel={() => setEditCondition(null)}
          open={!!editCondition}
        />
      )}
    </>
  );
};

export default CommercialConditionsList;
