
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { AddressSection } from "./AddressSection";
import { OmieStatusSection } from "./OmieStatusSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProfileForm: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const { toast: uiToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    specialty: profile?.specialty || '',
    cro: profile?.cro || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    zip_code: profile?.zip_code || '',
    neighborhood: profile?.neighborhood || '',
    endereco_numero: profile?.endereco_numero || '',
    complemento: profile?.complemento || '',
    cpf: profile?.cpf || '',
    cnpj: profile?.cnpj || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoSection 
            formData={formData} 
            handleChange={handleChange} 
            handleSelectChange={handleSelectChange} 
          />
          
          <ContactInfoSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          <AddressSection 
            formData={formData} 
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            setFormData={setFormData}
          />

          <OmieStatusSection omieCode={profile?.omie_code} />

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
  );
};
