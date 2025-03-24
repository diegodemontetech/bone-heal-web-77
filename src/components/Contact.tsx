
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
import { Input } from "@/components/ui/input";
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
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 15) setPhone(formatted);
  };

  const position: L.LatLngExpression = [-23.5505, -46.6333]; // São Paulo coordinates

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !department) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to contact_leads table for admin management
      const { error } = await supabase.from('contact_leads').insert({
        name,
        phone,
        reason: department,
        source: 'contact_form',
        status: 'new',
        message: message,
        email: email || null
      });
      
      if (error) {
        console.error('Error submitting contact form:', error);
        throw error;
      }
      
      // Also create a CRM contact in the Hunting pipeline
      try {
        // Get the first stage ID of the Hunting pipeline
        const { data: stageData } = await supabase
          .from('crm_stages')
          .select('id')
          .eq('pipeline_id', 'a1f15c3f-5c88-4a9a-b867-6107e160f045') // Hunting Ativo pipeline ID
          .order('order_index', { ascending: true })
          .limit(1);
        
        if (stageData && stageData.length > 0) {
          const stageId = stageData[0].id;
          
          // Create CRM contact
          await supabase.from('crm_contacts').insert({
            full_name: name,
            whatsapp: phone,
            email: email || null,
            pipeline_id: 'a1f15c3f-5c88-4a9a-b867-6107e160f045', // Hunting Ativo pipeline ID
            stage_id: stageId,
            observations: `Contato via formulário do site. Departamento: ${department}. Mensagem: ${message}`,
            client_type: 'Lead'
          });
        }
      } catch (crmError) {
        // Log CRM creation error but don't fail the submission
        console.error('Error creating CRM contact:', crmError);
      }
      
      toast.success("Mensagem enviada com sucesso!");
      setIsSubmitted(true);
      
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [
    { id: 1, department: 'Comercial' },
    { id: 2, department: 'Logística' },
    { id: 3, department: 'Administrativo' },
    { id: 4, department: 'Suporte Técnico' },
    { id: 5, department: 'Consultoria' },
  ];

  return (
    <section className="bg-primary" id="contact">
      <div className="container mx-auto container-padding pt-32 pb-24">
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
                <p className="text-sm text-primary">WhatsApp</p>
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
                <label className="block text-sm font-medium mb-2">Departamento<span className="text-red-500">*</span></label>
                <Select 
                  value={department} 
                  onValueChange={setDepartment}
                  required
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.department}>
                        {dept.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nome<span className="text-red-500">*</span></label>
                <Input
                  type="text"
                  className="w-full"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  className="w-full"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefone<span className="text-red-500">*</span></label>
                <Input
                  type="tel"
                  className="w-full"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea
                  className="w-full h-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Sua mensagem"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary-light transition-colors duration-200 rounded-lg text-white font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
