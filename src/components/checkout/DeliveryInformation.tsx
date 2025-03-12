
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { states } from "@/utils/states";
import { useProfileData } from '@/hooks/use-profile-data';

const DeliveryInformation = () => {
  const { profileData, loading } = useProfileData();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        address: profileData.address || '',
        number: profileData.endereco_numero || '',
        complement: profileData.complemento || '',
        neighborhood: profileData.neighborhood || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zipCode: profileData.zip_code || ''
      });
    }
  }, [profileData]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Informações de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              value={formData.address} 
              readOnly={!editMode}
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input 
              id="number" 
              value={formData.number} 
              readOnly={!editMode}
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input 
              id="complement" 
              value={formData.complement} 
              readOnly={!editMode}
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input 
              id="neighborhood" 
              value={formData.neighborhood} 
              readOnly={!editMode}
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input 
              id="city" 
              value={formData.city} 
              readOnly={!editMode}
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            {editMode ? (
              <Select value={formData.state} disabled={!editMode}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.sigla} value={state.sigla}>
                      {state.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                id="state" 
                value={formData.state} 
                readOnly={true}
                className="bg-gray-50"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input 
              id="zipCode" 
              value={formData.zipCode} 
              readOnly={!editMode}
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryInformation;
