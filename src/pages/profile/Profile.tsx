
import React from 'react';
import { useAuthContext } from '@/hooks/auth/auth-context';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { SupportButtonsSection } from '@/components/profile/SupportButtonsSection';
import { OmieStatusSection } from '@/components/profile/OmieStatusSection';

const Profile = () => {
  const { profile, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Perfil não encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Você precisa estar logado para acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              {/* O componente ProfileForm não espera props, então remova a passagem de profile */}
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <OmieStatusSection omieCode={profile.omie_code} />
          <SupportButtonsSection />
        </div>
      </div>
    </div>
  );
};

export default Profile;
