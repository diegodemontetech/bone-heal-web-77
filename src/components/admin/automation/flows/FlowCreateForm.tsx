
import { FC } from "react";
import { DialogWrapper } from "./components/DialogWrapper";
import { FormContent } from "./components/FormContent";
import { useFlowFormData, flowFormSchema, FlowFormValues } from "./hooks/useFlowFormData";

interface FlowCreateFormProps {
  onCreateFlow: (name: string, description: string, departmentId?: string, responsibleId?: string, hasAttachment?: boolean) => Promise<any>;
  onComplete: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (name: string, description: string, departmentId?: string, responsibleId?: string, hasAttachment?: boolean) => Promise<any>;
}

const FlowCreateForm: FC<FlowCreateFormProps> = ({ 
  onCreateFlow, 
  onComplete, 
  isOpen = false, 
  onClose,
  onSubmit 
}: FlowCreateFormProps) => {
  const {
    form,
    isSubmitting,
    departments,
    users,
    handleCreate
  } = useFlowFormData(
    onSubmit || onCreateFlow,
    onComplete,
    onClose
  );

  // Versão com Dialog
  if (isOpen !== undefined) {
    return (
      <DialogWrapper 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Criar Novo Pipeline de Automação"
      >
        <FormContent
          form={form}
          departments={departments}
          users={users}
          isSubmitting={isSubmitting}
          onSubmit={handleCreate}
          onClose={onClose}
          inDialog={true}
        />
      </DialogWrapper>
    );
  }

  // Versão sem Dialog (compatibilidade com código anterior)
  return (
    <FormContent
      form={form}
      departments={departments}
      users={users}
      isSubmitting={isSubmitting}
      onSubmit={handleCreate}
      inDialog={false}
    />
  );
};

// Exportando o componente e o tipo para ser usado em outros lugares
export default FlowCreateForm;
export type { FlowFormValues };
