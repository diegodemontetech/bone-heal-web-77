
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
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-8">
        <RegistrationFormFields form={form} specialties={specialties || []} />
        <Button 
          type="submit" 
          className={`w-full ${
            (!form.formState.isDirty || !form.formState.isValid || form.formState.isSubmitting || specialtiesLoading)
              ? "opacity-50"
              : "bg-[#8B1F41] hover:bg-[#6E1A35]"
          }`}
          disabled={!form.formState.isDirty || !form.formState.isValid || form.formState.isSubmitting || specialtiesLoading}
        >
          {form.formState.isSubmitting ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
