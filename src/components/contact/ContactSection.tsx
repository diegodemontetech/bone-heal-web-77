
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ContactForm from './ContactForm';
import ContactCard from './ContactCard';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ContactSection = () => {
  const position: L.LatLngExpression = [-23.5505, -46.6333]; // São Paulo coordinates

  return (
    <section className="bg-primary" id="contact">
      <div className="container mx-auto container-padding pt-32 pb-24">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-white">
          Central de Atendimento
        </h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Contact Information */}
            <ContactCard 
              icon={<Phone className="w-5 h-5 text-primary" />}
              title="Telefone"
            >
              <p className="text-lg">(11) 94512-2884</p>
              <p className="text-sm text-primary">WhatsApp</p>
            </ContactCard>

            {/* Email Sections */}
            <ContactCard 
              icon={<Mail className="w-5 h-5 text-primary" />}
              title="E-mails"
            >
              <div className="space-y-4">
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
              </div>
            </ContactCard>

            {/* Business Hours */}
            <ContactCard 
              icon={<Clock className="w-5 h-5 text-primary" />}
              title="Horário de Atendimento"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">SEGUNDA À QUINTA-FEIRA</h4>
                  <p>Das 8h00 às 17h50</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">SEXTA-FEIRA</h4>
                  <p>Das 8h00 às 16h50</p>
                </div>
                <div className="pt-2 border-t">
                  <h4 className="font-semibold mb-1">RETIRADA DE ENCOMENDAS</h4>
                  <p>SEGUNDA À SEXTA-FEIRA</p>
                  <p>Das 8h00 às 16h30</p>
                  <p className="mt-2 text-primary-dark font-medium">Consulte-nos. Não somos loja. É necessário pedir, pagar, faturar, separar e embalar primeiro.</p>
                </div>
              </div>
            </ContactCard>

            {/* Location */}
            <ContactCard 
              icon={<MapPin className="w-5 h-5 text-primary" />}
              title="Onde Estamos"
            >
              <p>Rua Anália Franco, 336 - Vila Reg. Feijó, São Paulo - SP, 03344-040</p>
            </ContactCard>

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
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
