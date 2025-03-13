
export const fieldTypes = [
  { id: "text", name: "Texto" },
  { id: "number", name: "Número" },
  { id: "date", name: "Data" },
  { id: "datetime", name: "Data e Hora" },
  { id: "currency", name: "Valor (R$)" },
  { id: "percent", name: "Percentual" },
  { id: "select", name: "Seleção" },
  { id: "multiselect", name: "Múltipla Escolha" },
  { id: "checkbox", name: "Caixa de Seleção" },
  { id: "timer", name: "Cronômetro" },
  { id: "phone", name: "Telefone" },
  { id: "email", name: "E-mail" },
  { id: "cpf", name: "CPF" },
  { id: "cnpj", name: "CNPJ" },
  { id: "cep", name: "CEP" }
];

export interface Field {
  id: string;
  name: string;
  type: string;
  department: string;
  required: boolean;
  showInCard: boolean;
  showInKanban: boolean;
}
