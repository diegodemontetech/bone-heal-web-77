import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { DepartmentForm } from "./DepartmentForm";
import { CategoryForm } from "./CategoryForm";
import { SubcategoryForm } from "./SubcategoryForm";
import { ProductDepartment, ProductCategory, ProductSubcategory } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { parseJsonObject } from "@/utils/supabaseJsonUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DepartmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<ProductDepartment[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([]);
  
  const [departmentFormOpen, setDepartmentFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [subcategoryFormOpen, setSubcategoryFormOpen] = useState(false);
  
  const [editingDepartment, setEditingDepartment] = useState<ProductDepartment | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<ProductSubcategory | null>(null);
  const [cloningSubcategory, setCloningSubcategory] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState("departments");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      // Carregar departamentos
      const { data: deptData, error: deptError } = await supabase
        .from("product_departments")
        .select("*")
        .order("name");
        
      if (deptError) throw deptError;
      setDepartments(deptData || []);
      
      // Carregar categorias
      const { data: catData, error: catError } = await supabase
        .from("product_categories")
        .select("*")
        .order("name");
        
      if (catError) throw catError;
      setCategories(catData || []);
      
      // Carregar subcategorias
      const { data: subData, error: subError } = await supabase
        .from("product_subcategories")
        .select("*")
        .order("name");
        
      if (subError) throw subError;
      
      // Processar os default_fields para converter de Json para Record<string, any>
      const processedSubcategories = subData?.map(sub => ({
        ...sub,
        default_fields: parseJsonObject(sub.default_fields, {})
      })) || [];
      
      setSubcategories(processedSubcategories);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditDepartment = (department: ProductDepartment) => {
    setEditingDepartment(department);
    setDepartmentFormOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleEditSubcategory = (subcategory: ProductSubcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryFormOpen(true);
  };

  const handleCloneSubcategory = (id: string) => {
    setCloningSubcategory(id);
    setSubcategoryFormOpen(true);
  };

  const confirmDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const { type, id } = itemToDelete;
      let table = "";
      
      switch (type) {
        case "department":
          table = "product_departments";
          break;
        case "category":
          table = "product_categories";
          break;
        case "subcategory":
          table = "product_subcategories";
          break;
      }
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success(`${type} excluído com sucesso`);
      loadData();
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      toast.error(`Erro ao excluir: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const getDepartmentName = (id: string) => {
    const department = departments.find(d => d.id === id);
    return department?.name || "Departamento não encontrado";
  };

  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category?.name || "Categoria não encontrada";
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organização de Produtos</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                setEditingDepartment(null);
                setDepartmentFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Departamento
            </Button>
          </div>
          
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ) : departments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground mb-4">
                  Nenhum departamento cadastrado.
                </p>
                <Button 
                  onClick={() => {
                    setEditingDepartment(null);
                    setDepartmentFormOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Criar Departamento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Departamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((department) => (
                    <div key={department.id} className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <h3 className="font-medium">{department.name}</h3>
                        {department.description && (
                          <p className="text-sm text-muted-foreground">{department.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditDepartment(department)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete("department", department.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                setEditingCategory(null);
                setCategoryFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Categoria
            </Button>
          </div>
          
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground mb-4">
                  Nenhuma categoria cadastrada.
                </p>
                <Button 
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryFormOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Criar Categoria
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Departamento: {getDepartmentName(category.department_id)}
                        </p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete("category", category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="subcategories" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                setEditingSubcategory(null);
                setCloningSubcategory(null);
                setSubcategoryFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Subcategoria
            </Button>
          </div>
          
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ) : subcategories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground mb-4">
                  Nenhuma subcategoria cadastrada.
                </p>
                <Button 
                  onClick={() => {
                    setEditingSubcategory(null);
                    setCloningSubcategory(null);
                    setSubcategoryFormOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Criar Subcategoria
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Subcategorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <h3 className="font-medium">{subcategory.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Categoria: {getCategoryName(subcategory.category_id)}
                        </p>
                        {subcategory.description && (
                          <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCloneSubcategory(subcategory.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditSubcategory(subcategory)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete("subcategory", subcategory.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {departmentFormOpen && (
        <DepartmentForm
          department={editingDepartment}
          open={departmentFormOpen}
          onClose={() => {
            setDepartmentFormOpen(false);
            setEditingDepartment(null);
          }}
          onSuccess={() => {
            setDepartmentFormOpen(false);
            setEditingDepartment(null);
            loadData();
          }}
        />
      )}
      
      {categoryFormOpen && (
        <CategoryForm
          category={editingCategory}
          open={categoryFormOpen}
          onClose={() => {
            setCategoryFormOpen(false);
            setEditingCategory(null);
          }}
          onSuccess={() => {
            setCategoryFormOpen(false);
            setEditingCategory(null);
            loadData();
          }}
        />
      )}
      
      {subcategoryFormOpen && (
        <SubcategoryForm
          subcategory={editingSubcategory}
          cloneFrom={cloningSubcategory || undefined}
          open={subcategoryFormOpen}
          onClose={() => {
            setSubcategoryFormOpen(false);
            setEditingSubcategory(null);
            setCloningSubcategory(null);
          }}
          onSuccess={() => {
            setSubcategoryFormOpen(false);
            setEditingSubcategory(null);
            setCloningSubcategory(null);
            loadData();
          }}
        />
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
