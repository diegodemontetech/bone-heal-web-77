
import React from "react";
import { useProfileData } from "@/hooks/use-profile-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { states } from "@/utils/states";

const DeliveryInformation = () => {
  const { userData, loading } = useProfileData();

  // Função para obter o nome do estado a partir da sigla
  const getStateName = (uf: string) => {
    const stateObj = states.find(state => state.value === uf);
    return stateObj ? stateObj.label : uf;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando informações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">Endereço de entrega:</p>
          <p>
            {userData?.address || "Endereço não informado"}
            {userData?.endereco_numero ? `, ${userData.endereco_numero}` : ""}
            {userData?.complemento ? ` - ${userData.complemento}` : ""}
          </p>
          <p>
            {userData?.neighborhood || ""}
            {userData?.city ? ` - ${userData.city}` : ""}
            {userData?.state ? `, ${getStateName(userData.state)}` : ""}
          </p>
          <p>{userData?.zip_code || "CEP não informado"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryInformation;
