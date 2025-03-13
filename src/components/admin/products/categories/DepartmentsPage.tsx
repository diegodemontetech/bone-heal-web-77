import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductCategory, ProductDepartment, ProductSubcategory } from "@/types/product";
import { DepartmentForm } from "./DepartmentForm";
import { CategoryForm } from "./CategoryForm";
import { SubcategoryForm } from "./SubcategoryForm";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<ProductDepartment[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [openDepartmentForm, setOpenDepartmentForm] = useState(false);
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [openSubcategoryForm, setOpenSubcategoryForm] = useState(false);
  
  const [editDepartment, setEditDepartment] = useState<ProductDepartment | null>(null);
  const [editCategory, setEditCategory] = useState<ProductCategory | null>(null);
  const [editSubcategory, setEditSubcategory] = useState<ProductSubcategory | null>(null);
  
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: departmentsData, error: departmentsError } = await supabase
        .from("product_departments")
        .select("*")
        .order("name");

      if (departmentsError) throw departmentsError;
      setDepartments(departmentsData || []);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("product_categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from("product_subcategories")
        .select("*")
        .order("name");

      if (subcategoriesError) throw subcategoriesError;
      setSubcategories(subcategoriesData || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDepartmentForm = () => {
    setEditDepartment(null);
    setOpenDepartmentForm(true);
  };

  const handleOpenCategoryForm = (departmentId: string | null = null) => {
    setEditCategory(null);
    setSelectedDepartmentId(departmentId);
    setOpenCategoryForm(true);
  };

  const handleOpenSubcategoryForm = (categoryId: string | null = null) => {
    setEditSubcategory(null);
    setSelectedCategoryId(categoryId);
    setOpenSubcategoryForm(true);
  };

  const handleEditItem = (type: string, item: any) => {
    if (type === "department") {
      setEditDepartment(item);
      setOpenDepartmentForm(true);
    } else if (type === "category") {
      setEditCategory(item);
      setOpenCategoryForm(true);
      setSelectedDepartmentId(item.department_id);
    } else if (type === "subcategory") {
      setEditSubcategory(item);
      setOpenSubcategoryForm(true);
      const category = categories.find(c => c.id === item.category_id);
      setSelectedCategoryId(item.category_id);
      setSelectedDepartmentId(category?.department_id || null);
    }
  };

  const handleDeleteItem = async (type: string, id: string) => {
    try {
      let tableName: "product_departments" | "product_categories" | "product_subcategories";
      
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
        setSubcategories(subcategories.filter(sub => {
          const category = categories.find(c => c.id === sub.category_id);
          return category ? category.department_id !== id : true;
        }));
      } else if (type === "category") {
        setCategories(categories.filter(item => item.id !== id));
        setSubcategories(subcategories.filter(sub => sub.category_id !== id));
      } else {
        setSubcategories(subcategories.filter(item => item.id !== id));
      }
      
      toast.success(`Item excluído com sucesso`);
    } catch (err) {
      console.error("Erro ao excluir item:", err);
      toast.error("Erro ao excluir item");
    }
  };

  const DepartmentItem = ({ department }: { department: ProductDepartment }) => (
    <AccordionItem value={department.id}>
      <AccordionTrigger className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 peer-data-[state=expanded]:rotate-90" />
          <span>{department.name}</span>
          {department.description && (
            <Badge variant="secondary">{department.description}</Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-8">
        <div className="flex justify-end space-x-2 mb-2">
          <Button variant="outline" size="sm" onClick={() => handleEditItem("department", department)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteItem("department", department.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
        <CategoryList departmentId={department.id} />
      </AccordionContent>
    </AccordionItem>
  );

  const CategoryList = ({ departmentId }: { departmentId: string }) => {
    const filteredCategories = categories.filter(cat => cat.department_id === departmentId);

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Categorias</p>
          <Button variant="outline" size="sm" onClick={() => handleOpenCategoryForm(departmentId)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Categoria
          </Button>
        </div>
        {filteredCategories.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma categoria cadastrada.</p>
        ) : (
          filteredCategories.map(category => (
            <div key={category.id} className="border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{category.name}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditItem("category", category)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteItem("category", category.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
              <SubcategoryList categoryId={category.id} />
            </div>
          ))
        )}
      </div>
    );
  };

  const SubcategoryList = ({ categoryId }: { categoryId: string }) => {
    const filteredSubcategories = subcategories.filter(sub => sub.category_id === categoryId);

    return (
      <div className="space-y-2 ml-4 mt-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Subcategorias</p>
          <Button variant="outline" size="sm" onClick={() => handleOpenSubcategoryForm(categoryId)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Subcategoria
          </Button>
        </div>
        {filteredSubcategories.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma subcategoria cadastrada.</p>
        ) : (
          filteredSubcategories.map(subcategory => (
            <div key={subcategory.id} className="flex items-center justify-between border rounded-md p-2">
              <p className="text-sm">{subcategory.name}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditItem("subcategory", subcategory)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteItem("subcategory", subcategory.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <CardHeader>
          <CardTitle>Categorias de Produtos</CardTitle>
        </CardHeader>
        <Button onClick={handleOpenDepartmentForm}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Departamento
        </Button>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="departments">
          <Card>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Accordion type="single" collapsible>
                  {departments.map(department => (
                    <DepartmentItem key={department.id} department={department} />
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DepartmentForm
        open={openDepartmentForm}
        onClose={() => setOpenDepartmentForm(false)}
        onSuccess={fetchData}
        department={editDepartment}
      />
      <CategoryForm
        open={openCategoryForm}
        onClose={() => setOpenCategoryForm(false)}
        onSuccess={fetchData}
        department={selectedDepartmentId}
        category={editCategory}
      />
      <SubcategoryForm
        open={openSubcategoryForm}
        onClose={() => setOpenSubcategoryForm(false)}
        onSuccess={fetchData}
        category={categories.find(cat => cat.id === selectedCategoryId) || {} as ProductCategory}
        subcategory={editSubcategory}
      />
    </div>
  );
};

export default DepartmentsPage;
