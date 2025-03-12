
import { useState, useEffect } from "react";
import { useProfileData } from "@/hooks/use-profile-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAddressFromCep } from "@/utils/address";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { estados } from "@/utils/states";

interface DeliveryInformationProps {
  onNext: () => void;
  onSetShippingAddress: (address: any) => void;
}

export const DeliveryInformation = ({ onNext, onSetShippingAddress }: DeliveryInformationProps) => {
  const { userData, loading } = useProfileData();
  const [addressLoading, setAddressLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [useProfileAddress, setUseProfileAddress] = useState(true);
  
  // Carregar endereço do perfil quando disponível
  useEffect(() => {
    if (userData && useProfileAddress) {
      setZipCode(userData.zip_code || "");
      setAddress(userData.address || "");
      setNumber(userData.endereco_numero || "");
      setComplement(userData.complemento || "");
      setNeighborhood(userData.neighborhood || "");
      setCity(userData.city || "");
      setState(userData.state || "");
    }
  }, [userData, useProfileAddress]);
  
  const handleLookupZipCode = async () => {
    if (zipCode.length !== 8) {
      toast.error("CEP deve ter 8 dígitos");
      return;
    }
    
    setAddressLoading(true);
    try {
      const addressData = await fetchAddressFromCep(zipCode);
      if (addressData) {
        setAddress(addressData.logradouro || "");
        setNeighborhood(addressData.bairro || "");
        setCity(addressData.localidade || "");
        setState(addressData.uf || "");
        toast.success("Endereço encontrado");
      } else {
        toast.error("CEP não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP");
    } finally {
      setAddressLoading(false);
    }
  };
  
  const handleContinue = () => {
    if (!zipCode || !address || !number || !city || !state) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const shippingAddress = {
      zip_code: zipCode,
      address,
      number,
      complement,
      neighborhood,
      city,
      state
    };
    
    onSetShippingAddress(shippingAddress);
    onNext();
  };
  
  const handleUseProfileAddress = () => {
    setUseProfileAddress(true);
    
    if (userData) {
      setZipCode(userData.zip_code || "");
      setAddress(userData.address || "");
      setNumber(userData.endereco_numero || "");
      setComplement(userData.complemento || "");
      setNeighborhood(userData.neighborhood || "");
      setCity(userData.city || "");
      setState(userData.state || "");
    }
  };
  
  const handleUseNewAddress = () => {
    setUseProfileAddress(false);
    setZipCode("");
    setAddress("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setCity("");
    setState("");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Endereço de entrega</CardTitle>
        <CardDescription>Informe o endereço para entrega dos produtos</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {userData && (
              <div className="flex gap-4 mb-6">
                <Button
                  type="button"
                  variant={useProfileAddress ? "default" : "outline"}
                  onClick={handleUseProfileAddress}
                >
                  Usar endereço do perfil
                </Button>
                <Button
                  type="button"
                  variant={useProfileAddress ? "outline" : "default"}
                  onClick={handleUseNewAddress}
                >
                  Usar novo endereço
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <div className="flex mt-1">
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="Apenas números"
                      maxLength={8}
                      className="rounded-r-none"
                    />
                    <Button
                      type="button"
                      onClick={handleLookupZipCode}
                      className="rounded-l-none"
                      disabled={addressLoading}
                    >
                      {addressLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1"
                  disabled={addressLoading}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="mt-1"
                    disabled={addressLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className="mt-1"
                    disabled={addressLoading}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="mt-1"
                  disabled={addressLoading}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1"
                    disabled={addressLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Select
                    value={state}
                    onValueChange={(value) => setState(value)}
                    disabled={addressLoading}
                  >
                    <SelectTrigger id="state" className="mt-1">
                      <SelectValue placeholder="Selecione um estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado.sigla} value={estado.sigla}>
                          {estado.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={handleContinue}
                  className="w-full md:w-auto"
                  disabled={addressLoading}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryInformation;
