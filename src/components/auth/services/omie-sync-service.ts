
import { supabase } from "@/integrations/supabase/client";

export const syncCustomerWithOmie = async (customer: any) => {
  try {
    console.log("Tentando sincronizar cliente com Omie:", customer);
    
    const response = await fetch(`${window.location.origin}/api/omie-customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile: customer }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API Omie:", errorText);
      console.warn("Continuando com o cliente não-sincronizado...");
      return customer; // Retorna o cliente original se a sincronização falhar
    }
    
    let result;
    try {
      result = await response.json();
      console.log("Resultado da sincronização com Omie:", result);
    } catch (jsonError) {
      console.error("Erro ao processar resposta da API Omie:", jsonError);
      return customer;
    }
    
    if (result && result.success) {
      console.log("Sincronização com Omie realizada com sucesso");
      
      // Atualizar o cliente com o código Omie
      const { data: updatedCustomer, error: updateError } = await supabase
        .from("profiles")
        .update({ omie_code: result.omie_code, omie_sync: true })
        .eq("id", customer.id)
        .select()
        .single();
        
      if (!updateError && updatedCustomer) {
        console.log("Cliente atualizado com código Omie:", updatedCustomer);
        return updatedCustomer;
      }
    }
    return customer;
  } catch (omieError) {
    console.error("Erro ao sincronizar com Omie:", omieError);
    return customer; // Retorna o cliente original mesmo se a sincronização falhar
  }
};
