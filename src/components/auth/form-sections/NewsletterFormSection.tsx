
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../RegistrationForm";

interface NewsletterFormSectionProps {
  form: UseFormReturn<FormData>;
}

const NewsletterFormSection: React.FC<NewsletterFormSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="receiveNews"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-sm">
              Desejo receber novidades e promoções
            </FormLabel>
            <FormDescription>
              Fique por dentro das novidades e promoções da Bone Heal.
            </FormDescription>
          </div>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default NewsletterFormSection;
