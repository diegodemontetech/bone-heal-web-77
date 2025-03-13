
import { CRMConfigTabs } from "./CRMConfigTabs";

const CRMConfigPage = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações do CRM</h1>
        <p className="text-gray-500 mt-2">
          Configure departamentos, campos, estágios e automações para o CRM
        </p>
      </div>

      <CRMConfigTabs />
    </div>
  );
};

export default CRMConfigPage;
