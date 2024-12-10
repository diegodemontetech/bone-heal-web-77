import { Mail, Phone, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contact = () => {
  const { data: departments } = useQuery({
    queryKey: ['contactDepartments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_form_configs')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: -23.550520,  // São Paulo coordinates
    lng: -46.633308,
  };

  return (
    <section className="section-padding bg-primary" id="contact">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-white">
          Entre em Contato
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-primary">Fale Conosco</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <span>(11) 1234-5678</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <span>contato@boneheal.com.br</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          <form className="bg-white rounded-xl p-8 shadow-lg space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Departamento</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.department}>
                      {dept.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Seu nome"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mensagem</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                placeholder="Sua mensagem"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary hover:bg-primary-light transition-colors duration-200 rounded-lg text-white font-semibold"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;