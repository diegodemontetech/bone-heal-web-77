
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface ProfileData {
  full_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  neighborhood?: string;
  complemento?: string;
  endereco_numero?: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfileData(data || {});
      } catch (err) {
        console.error('Erro ao buscar dados do perfil:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setProfileData(prev => ({ ...prev, ...updates }));
      return true;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      throw err;
    }
  };

  return {
    profileData,
    loading,
    error,
    updateProfile
  };
};
