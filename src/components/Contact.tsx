import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from "sonner";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const position: L.LatLngExpression = [-23.5505, -46.6333]; // São Paulo coordinates

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso!");
    setIsSubmitted(true);
  };

  return (
    <section className="section-padding bg-primary" id="contact">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-white">
          Central de Atendimento
        </h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="bg-white rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Telefone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">(11) 94512-2884</p>
              </CardContent>
            </Card>

            {/* Email Sections */}
            <Card className="bg-white rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  E-mails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">VENDAS</h4>
                  <p>vendas@boneheal.com.br</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">PARA DÚVIDAS TÉCNICAS</h4>
                  <p>consultoria@boneheal.com.br</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">SAC</h4>
                  <p>sac@boneheal.com.br</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="bg-white rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">SEGUNDA À QUINTA-FEIRA</h4>
                  <p>Das 8h00 às 17h30</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">SEXTA-FEIRA</h4>
                  <p>Das 8h00 às 16h30</p>
                </div>
                <div className="pt-2 border-t">
                  <h4 className="font-semibold mb-1">RETIRADA DE ENCOMENDAS</h4>
                  <p>SEGUNDA À SEXTA-FEIRA</p>
                  <p>Das 8h00 às 16h30</p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-white rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Onde Estamos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Rua Anália Franco, 336 - Vila Reg. Feijó, São Paulo - SP, 03344-040</p>
              </CardContent>
            </Card>

            {/* Map */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg h-[400px] relative z-0">
              <MapContainer 
                className="h-full w-full"
                {...{
                  center: position,
                  zoom: 13,
                  scrollWheelZoom: false
                } as MapContainerProps}
              >
                <TileLayer
                  {...{
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  }}
                />
                <Marker position={position}>
                  <Popup>
                    Bone Heal <br /> São Paulo, SP
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Contact Form */}
          {isSubmitted ? (
            <div className="bg-white rounded-xl p-8 shadow-lg flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-4">Obrigado pelo Contato!</h3>
              <p className="text-lg text-gray-600">
                Recebemos sua mensagem e entraremos em contato o mais breve possível.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Departamento</label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
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
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder="Sua mensagem"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary-light transition-colors duration-200 rounded-lg text-white font-semibold"
              >
                Enviar Mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;