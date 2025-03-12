import { useProfileData } from "@/hooks/use-profile-data";

const DeliveryInformation = () => {
  // Remover referências a userData e substitui-las por dados do próprio componente
  // Por exemplo, em vez de
  // const { zip_code, address, city, state } = userData;
  // Usar informações do perfil ou formulário atual
  const profile = useProfileData();
  const { zip_code, address, city, state } = profile || {};

  return (
    <div>
      <h2>Informações de Entrega</h2>
      <p>CEP: {zip_code}</p>
      <p>Endereço: {address}</p>
      <p>Cidade: {city}</p>
      <p>Estado: {state}</p>
    </div>
  );
};

export default DeliveryInformation;
