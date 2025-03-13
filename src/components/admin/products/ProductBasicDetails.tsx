import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductDepartment, ProductCategory, ProductSubcategory } from "@/types/product";

const ProductBasicDetails = ({ form }: { form: any }) => {
  const [departments, setDepartments] = useState<ProductDepartment[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<ProductSubcategory[]>([]);

  const selectedDepartment = form.watch("department_id");
  const selectedCategory = form.watch("category_id");

  useEffect(() => {
    async function loadCategoriesData() {
      try {
        // Carregar departamentos
        const { data: deptData } = await supabase
          .from("product_departments")
          .select("*")
          .order("name");
        
        setDepartments(deptData || []);
        
        // Carregar categorias
        const { data: catData } = await supabase
          .from("product_categories")
          .select("*")
          .order("name");
        
        setCategories(catData || []);
        
        // Carregar subcategorias
        const { data: subData } = await supabase
          .from("product_subcategories")
          .select("*")
          .order("name");
        
        setSubcategories(subData || []);
      } catch (error) {
        console.error("Erro ao carregar dados de categorias:", error);
      }
    }
    
    loadCategoriesData();
  }, []);

  // Filtrar categorias com base no departamento selecionado
  useEffect(() => {
    if (selectedDepartment) {
      setFilteredCategories(
        categories.filter(cat => cat.department_id === selectedDepartment)
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [selectedDepartment, categories]);

  // Filtrar subcategorias com base na categoria selecionada
  useEffect(() => {
    if (selectedCategory) {
      setFilteredSubcategories(
        subcategories.filter(sub => sub.category_id === selectedCategory)
      );
    } else {
      setFilteredSubcategories(subcategories);
    }
  }, [selectedCategory, subcategories]);

  return (
    

    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <Input placeholder="slug-do-produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="omie_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código OMIE</FormLabel>
              <FormControl>
                <Input placeholder="Código do produto no OMIE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <h3 className="text-lg font-medium mt-6">Categorização</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Limpar a categoria quando mudar o departamento
                  form.setValue("category_id", "");
                  form.setValue("subcategory_id", "");
                }} 
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Limpar a subcategoria quando mudar a categoria
                  form.setValue("subcategory_id", "");
                }} 
                value={field.value || ""}
                disabled={!selectedDepartment}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategory_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategoria</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
                disabled={!selectedCategory}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {filteredSubcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProductBasicDetails;
