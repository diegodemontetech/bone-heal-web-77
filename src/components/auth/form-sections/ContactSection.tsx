
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface ContactSectionProps {
  form: UseFormReturn<any>;
}

export const ContactSection = ({ form }: ContactSectionProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.replace(/\D/g, '');
    if (field === 'telefone1_ddd') {
      form.setValue('telefone1_ddd', value.substring(0, 2));
    } else {
      form.setValue('telefone1_numero', value.substring(0, 9));
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="telefone1_ddd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DDD</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => handlePhoneChange(e, 'telefone1_ddd')}
                  maxLength={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone1_numero"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => handlePhoneChange(e, 'telefone1_numero')}
                  maxLength={9}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="receiveNews"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Desejo receber novidades
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactSection;
