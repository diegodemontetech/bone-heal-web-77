
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductDepartment, ProductCategory } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Apenas definindo a interface correta da props para evitar erros de tipo
export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  department: ProductDepartment;
  category?: ProductCategory | null;
}

const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

export function CategoryForm({ open, onClose, onSuccess, department, category }: CategoryFormProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    setLoading(true);
    try {
      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("product_categories")
          .update({ name: values.name })
          .eq("id", category.id);

        if (error) {
          throw error;
        }
        toast.success("Category updated successfully!");
      } else {
        // Create new category
        const { error } = await supabase
          .from("product_categories")
          .insert({ 
            name: values.name, 
            department_id: department.id 
          });

        if (error) {
          throw error;
        }
        toast.success("Category created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Create Category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
