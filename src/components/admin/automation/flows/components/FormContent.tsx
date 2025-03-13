
import { FC } from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FlowFormValues } from "../FlowCreateForm";
import { FormFields } from "./FormFields";
import { FormActions } from "./FormActions";

interface FormContentProps {
  form: UseFormReturn<FlowFormValues>;
  departments: any[];
  users: any[];
  isSubmitting: boolean;
  onSubmit: (values: FlowFormValues) => Promise<void>;
  onClose?: () => void;
  inDialog?: boolean;
}

export const FormContent: FC<FormContentProps> = ({
  form,
  departments,
  users,
  isSubmitting,
  onSubmit,
  onClose,
  inDialog = true
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormFields 
          form={form} 
          departments={departments} 
          users={users} 
        />
        <FormActions 
          isSubmitting={isSubmitting} 
          onClose={onClose}
          inDialog={inDialog} 
        />
      </form>
    </Form>
  );
};
