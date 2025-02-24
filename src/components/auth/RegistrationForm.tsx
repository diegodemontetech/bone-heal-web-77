
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import RegistrationFormFields from "./RegistrationFormFields";
import { formSchema, FormData } from "./types/registration-form";
import { useRegistration } from "./hooks/useRegistration";

const RegistrationForm = () => {
  const { specialties, specialtiesLoading, handleRegistration } = useRegistration();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pessoa_tipo: "fisica",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form submission attempted with data:', data);
    await handleRegistration(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <RegistrationFormFields form={form} specialties={specialties || []} />
        <div>
          <Button 
            type="submit" 
            disabled={!form.formState.isDirty || !form.formState.isValid || form.formState.isSubmitting || specialtiesLoading}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;
