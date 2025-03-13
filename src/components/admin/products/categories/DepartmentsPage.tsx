import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SubcategoryForm } from "./SubcategoryForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

const DepartmentsPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsOpenSubcategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("O nome da categoria é obrigatório");
      return;
    }

    try {
      const { error } = await supabase
        .from("product_categories")
        .insert([{ name: newCategoryName, description: newCategoryDescription }]);

      if (error) throw error;
      toast.success("Categoria criada com sucesso!");
      setNewCategoryName("");
      setNewCategoryDescription("");
      setIsCategoryDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;
    try {
      const { error } = await supabase
        .from("product_categories")
        .update({ name: editingCategory.name, description: editingCategory.description })
        .eq("id", editingCategory.id);

      if (error) throw error;
      toast.success("Categoria atualizada com sucesso!");
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        const { error } = await supabase
          .from("product_categories")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("Categoria excluída com sucesso!");
        fetchCategories();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory({ ...category });
    } else {
      setEditingCategory(null);
    }
    setIsCategoryDialogOpen(true);
  };

  const handleOpenSubcategoryModal = (category: Category) => {
    setSelectedCategory(category);
    setIsOpenSubcategoryModal(true);
    setSelectedSubcategory(null);
  };

  const handleOpenEditSubcategoryModal = (category: Category, subcategory: any) => {
    setSelectedCategory(category);
    setIsOpenSubcategoryModal(true);
    setSelectedSubcategory(subcategory);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorias de Produtos</h1>
        <Button onClick={() => openCategoryDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardContent>
            {loading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenSubcategoryModal(category)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Subcategoria
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditSubcategoryModal(category, null)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CardHeader>
      </Card>

      <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => !open && setIsCategoryDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </h2>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={editingCategory?.name || newCategoryName}
                  onChange={(e) =>
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, name: e.target.value })
                      : setNewCategoryName(e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={editingCategory?.description || newCategoryDescription}
                  onChange={(e) =>
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, description: e.target.value })
                      : setNewCategoryDescription(e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsCategoryDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={editingCategory ? handleEditCategory : handleCreateCategory}>
                {editingCategory ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SubcategoryForm
        isOpen={isSubcategoryModalOpen}
        onClose={() => setIsOpenSubcategoryModal(false)}
        onSuccess={fetchCategories}
        category={selectedCategory}
        subcategory={selectedSubcategory}
      />
    </div>
  );
};

export default DepartmentsPage;
