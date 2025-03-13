
import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  omie_code: z.string().min(1, "Código Omie é obrigatório"),
  weight: z.coerce.number().min(0, "Peso deve ser maior que 0"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  video_url: z.string().optional(),
  department_id: z.string().optional(),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
});

export const departmentFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  department_id: z.string().min(1, "Departamento é obrigatório"),
  description: z.string().optional(),
});

export const subcategoryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().optional(),
  default_fields: z.record(z.any()).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;
