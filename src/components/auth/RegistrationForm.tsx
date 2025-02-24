
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import RegistrationFormFields from "./RegistrationFormFields";
import { formSchema, FormData } from "./types/registration-form";
import { useRegistration } from "./hooks/useRegistration";

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
      console.log('Tentando enviar formulário com dados:', data);
      await handleRegistration(data);
    } catch (error) {
      console.error('Erro no envio do formulário:', error);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8"
      >
        <RegistrationFormFields 
          form={form} 
          specialties={specialties || []} 
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
