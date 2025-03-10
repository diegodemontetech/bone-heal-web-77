
import { useState } from "react";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { AddressSection } from "./AddressSection";
import { OmieStatusSection } from "./OmieStatusSection";
import { TicketsSection } from "./TicketsSection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ProfileForm = () => {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    specialty: profile?.specialty || "",
    cro: profile?.cro || "",
    cpf: profile?.cpf || "",
    cnpj: profile?.cnpj || "",
    phone: profile?.phone || "",
    zip_code: profile?.zip_code || "",
    address: profile?.address || "",
    endereco_numero: profile?.endereco_numero || "",
    complemento: profile?.complemento || "",
    neighborhood: profile?.neighborhood || "",
    city: profile?.city || "",
    state: profile?.state || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.id) {
      toast.error("Você precisa estar logado para atualizar seu perfil");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", profile.id);
      
      if (error) throw error;
      
      await refreshProfile();
      toast.success("Perfil atualizado com sucesso");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <PersonalInfoSection 
        formData={formData} 
        handleChange={handleChange} 
        handleSelectChange={handleSelectChange} 
      />
      
      <AddressSection 
        formData={formData} 
        handleChange={handleChange} 
        handleSelectChange={handleSelectChange}
        setFormData={setFormData}
      />
      
      <OmieStatusSection />
      
      <TicketsSection />
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};
