
import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  omie_code: z.string().min(1, "Código Omie é obrigatório"),
  weight: z.coerce.number().min(0, "Peso deve ser maior que 0"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  video_url: z.string().optional(),
  categories: z.array(z.string()).default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
