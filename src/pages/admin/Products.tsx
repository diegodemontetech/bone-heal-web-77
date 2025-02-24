
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import ProductForm from "@/components/admin/ProductForm";

const AdminProducts = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const { data: products, refetch, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      console.log("Fetching admin products...");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;

      console.log("Admin products fetched:", data);
      return data;
    },
  });

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: `Produto ${!currentActive ? "ativado" : "desativado"} com sucesso`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status do produto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produto excluído com sucesso",
    });
    refetch();
  };

  const syncOmieProducts = async () => {
    try {
      setIsSyncing(true);
      console.log("Iniciando sincronização com Omie...");
      
      const { data, error } = await supabase.functions.invoke('omie-products');
      
      if (error) throw error;

      console.log("Resposta da sincronização:", data);
      
      if (data.success) {
        toast({
          title: "Sincronização concluída",
          description: data.message,
        });
        refetch();
      } else {
        throw new Error(data.error || "Erro desconhecido na sincronização");
      }
    } catch (error: any) {
      console.error("Erro na sincronização:", error);
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: "BONE HEAL MEMBRANA REGENERATIVA ODONTOLÓGICA - TAMANHO 30X40 mm",
          slug: "bone-heal-membrana-regenerativa-odontologica-30x40",
          omie_code: "BH30401",
          omie_product_id: "7630401",
          price: 320.00,
          stock: 0,
          active: true,
          short_description: "Membrana regenerativa odontológica Bone Heal, tamanho 30x40mm",
          description: "Membrana regenerativa odontológica Bone Heal, tamanho 30x40mm. Código NCM: 3006.10.90. EAN: 7898994908401",
          technical_details: {
            ncm: "3006.10.90",
            ean: "7898994908401",
            family: "Bone Heal",
            dimensions: "30x40mm",
            unit: "UN"
          },
          width: 30,
          height: 40,
          length: 1,
          weight: 0.1,
          default_image_url: "public/lovable-uploads/0a6d1a02-a166-4ef7-a719-07474622ee16.png",
          omie_sync: true,
          omie_last_update: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Produto cadastrado com sucesso",
        description: "O produto foi sincronizado com o Omie."
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={syncOmieProducts}
              disabled={isSyncing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? "Sincronizando..." : "Sincronizar com Omie"}
            </Button>
            <Button onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código Omie</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Status Omie</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.omie_code || "Não sincronizado"}</TableCell>
                    <TableCell>
                      {product.price
                        ? `R$ ${product.price.toFixed(2)}`
                        : "Não definido"}
                    </TableCell>
                    <TableCell>{product.stock || 0}</TableCell>
                    <TableCell>
                      {product.omie_last_update 
                        ? new Date(product.omie_last_update).toLocaleString()
                        : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.omie_sync 
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {product.omie_sync ? "Sincronizado" : "Pendente"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.active}
                        onCheckedChange={() => handleToggleActive(product.id, product.active)}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsFormOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {isFormOpen && (
          <ProductForm
            product={editingProduct}
            onClose={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
              refetch();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
