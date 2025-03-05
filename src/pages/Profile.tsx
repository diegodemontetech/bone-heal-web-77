
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useAuth } from "@/hooks/use-auth-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brazilianStates } from "@/utils/states";
import { dentistSpecialties } from "@/utils/specialties";
import { fetchAddressFromCep } from "@/utils/address";
import { toast } from "sonner";

const Profile = () => {
  const { profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    specialty: '',
    cro: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    neighborhood: '',
    endereco_numero: '',
    complemento: '',
    cpf: '',
    cnpj: '',
  });

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/login");
      return;
    }

    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        specialty: profile.specialty || '',
        cro: profile.cro || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || '',
        neighborhood: profile.neighborhood || '',
        endereco_numero: profile.endereco_numero || '',
        complemento: profile.complemento || '',
        cpf: profile.cpf || '',
        cnpj: profile.cnpj || '',
      });
    }
  }, [isLoading, profile, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCepBlur = async (cep: string) => {
    if (cep.length === 8) {
      setAddressLoading(true);
      try {
        const addressData = await fetchAddressFromCep(cep);
        if (addressData) {
          setFormData(prev => ({
            ...prev,
            address: addressData.logradouro || prev.address,
            neighborhood: addressData.bairro || prev.neighborhood,
            city: addressData.localidade || prev.city,
            state: addressData.uf || prev.state,
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        toast.error("Não foi possível encontrar o endereço para este CEP");
      } finally {
        setAddressLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!profile?.id) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          specialty: formData.specialty,
          cro: formData.cro,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          neighborhood: formData.neighborhood,
          endereco_numero: formData.endereco_numero,
          complemento: formData.complemento,
          cpf: formData.cpf,
          cnpj: formData.cnpj,
        })
        .eq("id", profile.id);

      if (error) throw error;

      // Atualizar o perfil no contexto
      await refreshProfile();

      // Verificar se precisa sincronizar com Omie
      if (!profile.omie_code) {
        toast.info("Sincronizando com o sistema Omie...");
        
        try {
          const response = await fetch(`${window.location.origin}/api/omie-customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: profile.id }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            toast.success("Perfil sincronizado com o Omie");
            await refreshProfile();
          } else {
            toast.error("Erro ao sincronizar com o Omie: " + (result.error || "Erro desconhecido"));
          }
        } catch (omieError) {
          console.error("Erro ao sincronizar com Omie:", omieError);
          toast.error("Erro ao sincronizar com o Omie");
        }
      }

      uiToast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      uiToast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4 flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('specialty', value)}
                    value={formData.specialty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {dentistSpecialties.map((specialty) => (
                        <SelectItem key={specialty.value} value={specialty.value}>
                          {specialty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cro">CRO</Label>
                  <Input
                    id="cro"
                    value={formData.cro}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <div className="relative">
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData(prev => ({ ...prev, zip_code: value }));
                      }}
                      maxLength={8}
                      onBlur={(e) => handleCepBlur(e.target.value)}
                    />
                    {addressLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <div className="relative">
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco_numero">Número</Label>
                  <Input
                    id="endereco_numero"
                    value={formData.endereco_numero}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('state', value)}
                    value={formData.state}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {brazilianStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {profile?.omie_code && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 font-medium">
                    Cliente sincronizado com Omie
                  </p>
                  <p className="text-sm text-green-600">
                    Código Omie: {profile.omie_code}
                  </p>
                </div>
              )}

              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Profile;
