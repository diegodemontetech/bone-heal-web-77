
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import RegistrationFormFields from "./RegistrationFormFields";
import { formSchema, FormData } from "./types/registration-form";
import { useRegistration } from "./hooks/useRegistration";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const { specialties, specialtiesLoading, handleRegistration } = useRegistration();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pessoa_tipo: "fisica",
      receive_news: false,
      city: "",
      state: "",
    },
    mode: "onChange"
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form submission started with data:', data);
      await handleRegistration(data);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao registrar usuário');
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const formErrors = form.formState.errors;

  if (specialtiesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  console.log('Form validation state:', {
    isSubmitting,
    formErrors,
    values: form.getValues()
  });

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
        
        <div className="mt-8 space-y-4">
          <Button 
            type="submit"
            variant="default"
            size="lg"
            className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Registrando...</span>
              </div>
            ) : (
              "Registrar"
            )}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
                Entrar
              </Link>
            </span>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;
