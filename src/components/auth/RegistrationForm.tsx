
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import RegistrationFormFields from "./RegistrationFormFields";
import { formSchema, FormData } from "./types/registration-form";
import { useRegistration } from "./hooks/useRegistration";
import { toast } from "sonner";

const RegistrationForm = () => {
  const { specialties, handleRegistration } = useRegistration();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pessoa_tipo: "fisica",
    },
    mode: "onChange"
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Iniciando registro com dados:', data);
      await handleRegistration(data);
    } catch (error) {
      console.error('Erro no registro:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao registrar usuário');
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <RegistrationFormFields 
          form={form} 
          specialties={specialties || []} 
        />
        
        <Button 
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            "Registrar"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
