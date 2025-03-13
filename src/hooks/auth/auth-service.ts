
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserPermission, UserProfile } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

export async function fetchSession(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return null;
  }
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    
    // Converter o perfil da DB para UserProfile, garantindo compatibilidade
    const userProfile: UserProfile = {
      id: profileData.id,
      full_name: profileData.full_name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      role: profileData.role as UserRole || UserRole.DENTIST,
      is_admin: profileData.is_admin || false,
      specialty: profileData.specialty,
      omie_code: profileData.omie_code
    };
    
    return userProfile;
  } catch (error) {
    console.error('Erro ao buscar dados do perfil:', error);
    return null;
  }
}

export async function fetchUserPermissions(userId: string): Promise<UserPermission[]> {
  try {
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('user_permissions')
      .select('permission')
      .eq('user_id', userId);
      
    if (permissionsError) throw permissionsError;
    
    return permissionsData.map(p => p.permission as UserPermission);
  } catch (error) {
    console.error('Erro ao buscar permissões:', error);
    return [];
  }
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, userData: any) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...userData,
        role: userData.role || UserRole.DENTIST
      }
    }
  });
}

export async function signOutUser() {
  return supabase.auth.signOut();
}
