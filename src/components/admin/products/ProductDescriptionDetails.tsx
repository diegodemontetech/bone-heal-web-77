
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/hooks/use-product-form";

interface ProductDescriptionDetailsProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductDescriptionDetails = ({ form }: ProductDescriptionDetailsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="short_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição Curta</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição Completa</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link do Vídeo (YouTube)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://www.youtube.com/watch?v=..." />
            </FormControl>
            <FormDescription>
              Cole aqui o link completo do vídeo do YouTube
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductDescriptionDetails;
