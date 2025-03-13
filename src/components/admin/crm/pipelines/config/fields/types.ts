
import { CRMField } from "@/types/crm";

export type FieldFormData = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  display_in_kanban: boolean;
  options: string;
  mask: string;
  default_value: string;
};

export interface FieldItemProps {
  field: CRMField;
  onEdit: (field: CRMField) => void;
  onDelete: (fieldId: string) => void;
}

export interface FieldsListProps {
  fields: CRMField[];
  loading: boolean;
  onOpenDialog: (field?: CRMField) => void;
  onDeleteField: (fieldId: string) => void;
}

export interface FieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentField: CRMField | null;
  onSubmit: (e: React.FormEvent) => void;
  formData: FieldFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
  getDefaultMask: (type: string) => string;
}

export interface FieldsConfigProps {
  pipelineId: string;
}
