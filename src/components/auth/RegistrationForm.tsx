
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
  const { specialties, specialtiesLoading, handleRegistration } = useRegistration();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pessoa_tipo: "fisica",
    },
    mode: "onChange"
  });

  const onSubmit = async (data: FormData) => {
    try {
      await handleRegistration(data);
    } catch (error) {
      console.error('Erro no registro:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao registrar usuário');
    }
  };

  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;

  if (specialtiesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
        
        <div className="mt-6">
          <Button 
            type="submit"
            variant="default"
            size="lg"
            className="w-full min-h-[48px] text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              "Registrar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;
