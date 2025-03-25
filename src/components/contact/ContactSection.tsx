
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
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
    <section className="bg-gradient-to-r from-primary to-primary-dark" id="contato">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Central de Atendimento
          </h2>
          
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Map Column - Takes more space */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="bg-white rounded-xl overflow-hidden shadow-xl h-full min-h-[600px]">
                <MapContainer 
                  className="h-full w-full z-10"
                  {...{
                    center: position,
                    zoom: 13,
                    scrollWheelZoom: false,
                    style: { background: "#0EA5E9" } // Keeping the blue color for the map
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
            
            {/* Contact Form and Info Column */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col space-y-6">
              {/* Contact Form */}
              <ContactForm />
              
              {/* Contact Info Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <ContactCard 
                  icon={<Phone className="w-5 h-5 text-primary" />}
                  title="Telefone"
                >
                  <p className="text-lg">(11) 94512-2884</p>
                  <p className="text-sm text-primary">WhatsApp</p>
                </ContactCard>

                <ContactCard 
                  icon={<MapPin className="w-5 h-5 text-primary" />}
                  title="Onde Estamos"
                >
                  <p>Rua Anália Franco, 336 - Vila Reg. Feijó, São Paulo - SP, 03344-040</p>
                </ContactCard>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <ContactCard 
                  icon={<Mail className="w-5 h-5 text-primary" />}
                  title="E-mails"
                >
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold mb-1">VENDAS</h4>
                      <p>vendas@boneheal.com.br</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">DÚVIDAS TÉCNICAS</h4>
                      <p>consultoria@boneheal.com.br</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">SAC</h4>
                      <p>sac@boneheal.com.br</p>
                    </div>
                  </div>
                </ContactCard>

                <ContactCard 
                  icon={<Clock className="w-5 h-5 text-primary" />}
                  title="Horário de Atendimento"
                >
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold mb-1">SEGUNDA À QUINTA</h4>
                      <p>Das 8h00 às 17h50</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">SEXTA-FEIRA</h4>
                      <p>Das 8h00 às 16h50</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <h4 className="font-semibold mb-1">RETIRADA DE ENCOMENDAS</h4>
                      <p className="text-sm">SEGUNDA À SEXTA-FEIRA</p>
                      <p className="text-sm">Das 8h00 às 16h30</p>
                    </div>
                  </div>
                </ContactCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
