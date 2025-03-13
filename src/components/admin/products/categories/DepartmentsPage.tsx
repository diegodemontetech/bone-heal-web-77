import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DepartmentForm } from "./DepartmentForm";
import { CategoryForm } from "./CategoryForm";
import { SubcategoryForm } from "./SubcategoryForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductDepartment, ProductCategory, ProductSubcategory } from "@/types/product";
import { parseJsonObject } from "@/utils/supabaseJsonUtils";

export default function DepartmentsPage() {
  const [departmentFormOpen, setDepartmentFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [subcategoryFormOpen, setSubcategoryFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<ProductDepartment | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [departments, setDepartments] = useState<ProductDepartment[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from("product_departments")
        .select("*")
        .order("name");

      if (departmentsError) throw departmentsError;
      setDepartments(departmentsData as ProductDepartment[]);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("product_categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData as ProductCategory[]);

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from("product_subcategories")
        .select("*")
        .order("name");

      if (subcategoriesError) throw subcategoriesError;

      // Processar os dados para garantir que default_fields seja do tipo correto
      const processedSubcategories = subcategoriesData.map(subcat => ({
        ...subcat,
        default_fields: parseJsonObject(subcat.default_fields)
      })) as ProductSubcategory[];

      setSubcategories(processedSubcategories);
    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDepartmentForm = () => {
    setSelectedDepartment(null);
    setDepartmentFormOpen(true);
  };

  const handleOpenCategoryForm = (department: ProductDepartment) => {
    setSelectedDepartment(department);
    setSelectedCategory(null);
    setCategoryFormOpen(true);
  };

  const handleOpenSubcategoryForm = (category: ProductCategory) => {
    setSelectedCategory(category);
    setSubcategoryFormOpen(true);
  };

  const handleCloseDepartmentForm = () => {
    setDepartmentFormOpen(false);
    fetchData();
  };

  const handleCloseCategoryForm = () => {
    setCategoryFormOpen(false);
    fetchData();
  };

  const handleCloseSubcategoryForm = () => {
    setSubcategoryFormOpen(false);
    fetchData();
  };

  const handleEditDepartment = (department: ProductDepartment) => {
    setSelectedDepartment(department);
    setDepartmentFormOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setSelectedDepartment(departments.find(d => d.id === category.department_id) || null);
    setCategoryFormOpen(true);
  };

  const handleEditSubcategory = (subcategory: ProductSubcategory) => {
    setSelectedCategory(categories.find(c => c.id === subcategory.category_id) || null);
    setSubcategoryFormOpen(true);
  };

  const handleDeleteItem = async (type: string, id: string) => {
    try {
      // Determinar a tabela baseada no tipo
      let tableName = "";
      
      if (type === "department") {
        tableName = "product_departments";
      } else if (type === "category") {
        tableName = "product_categories";
      } else if (type === "subcategory") {
        tableName = "product_subcategories";
      } else {
        throw new Error("Tipo inválido");
      }
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (type === "department") {
        setDepartments(departments.filter(item => item.id !== id));
        setCategories(categories.filter(cat => cat.department_id !== id));
        setSubcategories(subcategories.filter(sub => sub.category_id !== id));
      } else if (type === "category") {
        setCategories(categories.filter(item => item.id !== id));
        setSubcategories(subcategories.filter(sub => sub.category_id !== id));
      } else if (type === "subcategory") {
        setSubcategories(subcategories.filter(item => item.id !== id));
      }
      
      toast.success(`${type === "department" ? "Departamento" : type === "category" ? "Categoria" : "Subcategoria"} excluído com sucesso`);
    } catch (error: any) {
      console.error(`Erro ao excluir ${type}:`, error);
      toast.error(`Erro ao excluir: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <DepartmentForm
        open={departmentFormOpen}
        onClose={() => setDepartmentFormOpen(false)}
        onSuccess={fetchData}
        department={selectedDepartment}
      />
      
      {selectedDepartment && (
        <CategoryForm
          open={categoryFormOpen}
          onClose={() => setCategoryFormOpen(false)}
          onSuccess={fetchData}
          department={selectedDepartment}
          category={selectedCategory}
        />
      )}
      
      {selectedCategory && (
        <SubcategoryForm
          open={subcategoryFormOpen}
          onClose={() => setSubcategoryFormOpen(false)}
          onSuccess={fetchData}
          category={selectedCategory}
          subcategory={subcategories.find(sub => sub.category_id === selectedCategory.id)}
        />
      )}

      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Departamentos, Categorias e Subcategorias</h1>
        <Button onClick={handleOpenDepartmentForm}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Departamento
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          Carregando...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Departments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {departments.map(department => (
                  <li key={department.id} className="border rounded-md p-2 flex items-center justify-between">
                    <span>{department.name}</span>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => handleEditDepartment(department)}>
                        <Pencil className="h-4 w-4 mr-2" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100" onClick={() => handleDeleteItem("department", department.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenCategoryForm(department)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Categoria
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {categories.map(category => (
                  <li key={category.id} className="border rounded-md p-2 flex items-center justify-between">
                    <span>{category.name} ({departments.find(d => d.id === category.department_id)?.name})</span>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                        <Pencil className="h-4 w-4 mr-2" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100" onClick={() => handleDeleteItem("category", category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenSubcategoryForm(category)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Subcategoria
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Subcategories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subcategorias</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {subcategories.map(subcategory => (
                  <li key={subcategory.id} className="border rounded-md p-2 flex items-center justify-between">
                    <span>{subcategory.name} ({categories.find(c => c.id === subcategory.category_id)?.name})</span>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => handleEditSubcategory(subcategory)}>
                        <Pencil className="h-4 w-4 mr-2" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100" onClick={() => handleDeleteItem("subcategory", subcategory.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
